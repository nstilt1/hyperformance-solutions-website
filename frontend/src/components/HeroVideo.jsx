"use client";

import { useEffect, useRef, useState } from "react";

// ── Media URLs ────────────────────────────────────────────────────────────
const SOURCE_IMAGE_URL = "/wasm-assets/og-pink-flower-comp-3.jpg";

const FALLBACK_VIDEO_URL =
  "https://cdn.hyperformancesolutions.com/media/output-wv1-720-8.mp4";

const FIRST_FRAME_IMAGE_URL =
  "https://cdn.hyperformancesolutions.com/media/images/kaleidomo-first-frame.jpg";

// ── WASM URLs ─────────────────────────────────────────────────────────────
const WASM_JS_URL  = "/wasm/kaleidomo_core.js";
const WASM_BIN_URL = "/wasm/kaleidomo_core_bg.wasm";

const DEBUG = true;

// ── Module-level WASM initialisation cache ────────────────────────────────
// The JS module + wasm binary init is done once and cached. This is safe
// because wasm-bindgen's init() is idempotent after the first call, but
// running it concurrently (Strict Mode double-mount) corrupts internal state.
let wasmModPromise = null;

async function getWasmMod() {
  if (!wasmModPromise) {
    wasmModPromise = (async () => {
      const wasmBinUrl = new URL(WASM_BIN_URL, window.location.origin);
      const mod = await import(/* webpackIgnore: true */ WASM_JS_URL);
      await mod.default(wasmBinUrl);
      return mod;
    })().catch((e) => {
      wasmModPromise = null; // allow retry on next mount
      throw e;
    });
  }
  return wasmModPromise;
}

// ── Serialisation mutex ───────────────────────────────────────────────────
// React Strict Mode fires: mount → (sync) cleanup → mount.
// The second init() must not start until the first teardown() has finished
// freeing WASM objects, otherwise two engine instances share the same linear
// memory simultaneously and wasm-bindgen's internal buffer views go stale
// ("memory access out of bounds").
let lifecycleTail = Promise.resolve();

function serialise(fn) {
  const next = lifecycleTail.then(fn).catch(() => {});
  lifecycleTail = next;
  return next;
}

// ─────────────────────────────────────────────────────────────────────────

function debugLog(...args) {
  if (DEBUG) console.log("[HeroKaleido]", ...args);
}

function isReorientationFn(value) {
  return (
    value === "linear" ||
    value === "triangle" ||
    value === "saw" ||
    value === "sin" ||
    value === "sin2" ||
    value === "-cos"
  );
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

// Zoom and offset defaults — extracted as constants so callers can import
// them as a baseline when they only want to override one value.
export const HERO_VIDEO_DEFAULTS = {
  zoom_max: 0.9090958991783823,
  zoom_min: 0.85,
  offset_x: 354,
  offset_y: 0,
};

function applyVideoSettings(vs, controls, zoom_max, zoom_min) {
  const animationDuration = Math.max(
    0.001,
    finiteOr(controls.animationDuration, 100),
  );

  const reorientationDuration = finiteOr(controls.reorientationDuration, 64 * Math.PI);
  vs.animation_duration = animationDuration;

  vs.hue_range = 0;
  vs.hue_cycles = 0;
  vs.hue_start_offset = 0;
  vs.set_hue_fn("-cos");

  vs.rotation_range = 45;
  vs.rotation_cycles = 1;
  vs.rotation_start_offset = 0;
  vs.set_rotation_fn("sin2");

  vs.zoom_max = zoom_max;
  vs.zoom_min = zoom_min;
  vs.zoom_start_offset = 0;
  vs.num_zoom_loops = 4;
  vs.set_zoom_fn("sin");

  vs.orientation_range = 1;
  vs.orientation_cycles =
    reorientationDuration <= 0 ? 0 : 1 / reorientationDuration;

  vs.orientation_duration = reorientationDuration;
  vs.orientation_start_offset = 0;
  vs.set_orientation_fn(
    isReorientationFn(controls.reorientationFn)
      ? controls.reorientationFn
      : "linear",
  );
}

export function HeroVideo({
  controls,
  width = 1920,
  height = 1080,
  tile_count = 3,
  zoom_max = HERO_VIDEO_DEFAULTS.zoom_max,
  zoom_min = HERO_VIDEO_DEFAULTS.zoom_min,
  offset_x = HERO_VIDEO_DEFAULTS.offset_x,
  offset_y = HERO_VIDEO_DEFAULTS.offset_y,
}) {
  const canvasRef = useRef(null);
  const videoRef  = useRef(null);
  const engineRef = useRef(null);
  const vsRef     = useRef(null);
  const [useVideoFallback, setUseVideoFallback] = useState(false);
  const [debugNow, setDebugNow] = useState(0);
  const debugStartedAtRef = useRef(null);

  useEffect(() => {
    if (!useVideoFallback) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted        = true;
    video.defaultMuted = true;
    video.playsInline  = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        debugLog("Fallback video autoplay failed:", e);
      });
    }
  }, [useVideoFallback]);

  useEffect(() => {
    if (useVideoFallback) return;

    let ro = null;
    let cancelled = false;

    function activateVideoFallback(reason) {
      debugLog("activating video fallback:", reason);
      if (!cancelled) setUseVideoFallback(true);
    }

    function teardown() {
      const eng = engineRef.current;
      const vs  = vsRef.current;
      engineRef.current = null;
      vsRef.current     = null;
      try { eng?.stop_animation(); } catch { /* never started or already freed */ }
      try { eng?.free();           } catch { /* already freed */ }
      try { vs?.free();            } catch { /* already freed */ }
    }

    serialise(async () => {
      if (cancelled) return;

      debugLog("init() called");

      const canvas = canvasRef.current;
      if (!canvas) {
        activateVideoFallback("canvas ref is null");
        return;
      }

      function fitCanvas() {
        canvas.width  = width;
        canvas.height = height;
      }
      fitCanvas();

      let mod;
      try {
        mod = await getWasmMod();
      } catch (e) {
        activateVideoFallback(e);
        return;
      }

      if (cancelled) return;

      try {
        const engine = await new mod.LiveKaleidoscopeEngine(canvas);
        engineRef.current = engine;
      } catch (e) {
        activateVideoFallback(e);
        return;
      }

      if (cancelled) { teardown(); return; }

      try {
        await engineRef.current.load_image_from_url(SOURCE_IMAGE_URL);
      } catch (e) {
        teardown();
        activateVideoFallback(e);
        return;
      }

      if (cancelled) { teardown(); return; }

      const vs = new mod.WasmVideoSettings();
      vsRef.current = vs;
      applyVideoSettings(vs, controls, zoom_max, zoom_min);

      try {
        engineRef.current.start_animation(
          24,
          offset_x,
          offset_y,
          0.069, // zoom
          1.1,
          controls.triangleCenterX,
          controls.triangleCenterY,
          controls.triangleRotationRad,
          tile_count,
          260, // hue rotate
          vs,
        );
      } catch (e) {
        teardown();
        activateVideoFallback(e);
        return;
      }

      if (cancelled) { teardown(); return; }

      debugLog("animation started ✓");

      ro = new ResizeObserver(() => fitCanvas());
      ro.observe(canvas.parentElement ?? canvas);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      serialise(async () => teardown());
    };
  }, [useVideoFallback, width, height, tile_count, zoom_max, zoom_min, offset_x, offset_y]);

  useEffect(() => {
    const engine = engineRef.current;
    const vs     = vsRef.current;

    if (!engine || !vs || useVideoFallback) return;

    applyVideoSettings(vs, controls, zoom_max, zoom_min);

    try {
      engine.update_animation_settings(
        24,
        offset_x,
        offset_y,
        0.069, // zoom
        1.1,
        controls.triangleCenterX,
        controls.triangleCenterY,
        controls.triangleRotationRad,
        tile_count,
        260, // huerotate
        vs,
      );
    } catch (e) {
      debugLog("Failed to update hero controls:", e);
    }
  }, [controls, useVideoFallback, zoom_max, zoom_min, offset_x, offset_y]);

  useEffect(() => {
    if (!DEBUG) return;

    let raf = 0;

    function tick(now) {
      if (debugStartedAtRef.current === null) {
        debugStartedAtRef.current = now;
      }
      setDebugNow(now);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (useVideoFallback) {
    return (
      <video
        ref={videoRef}
        aria-label="Abstract Altered Brain Chemistry hero background"
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-full object-cover"
        style={{ pointerEvents: "none" }}
        src={FALLBACK_VIDEO_URL}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />
    );
  }

  const aspectStyle = { aspectRatio: `${width} / ${height}` };

  return (
    <>
      <img
        src={FIRST_FRAME_IMAGE_URL}
        alt=""
        aria-hidden="true"
        style={{ ...aspectStyle, pointerEvents: "none" }}
        className="
          absolute left-1/2 top-1/2
          h-full min-h-full min-w-full w-auto
          -translate-x-1/2 -translate-y-1/2
          object-cover
          max-md:h-screen max-md:w-auto max-md:rotate-90
        "
      />
      <canvas
        ref={canvasRef}
        aria-label="Abstract Altered Brain Chemistry hero background"
        aria-hidden="true"
        style={{ ...aspectStyle, pointerEvents: "none" }}
        className="
          absolute left-1/2 top-1/2
          h-full min-h-full min-w-full w-auto
          -translate-x-1/2 -translate-y-1/2
          object-cover
          max-md:h-screen max-md:w-auto max-md:rotate-90
        "
      />
      {process.env.NODE_ENV !== "production" && debugStartedAtRef.current !== null && (
        <div className="absolute bottom-4 left-4 z-50 rounded-lg bg-black/70 px-3 py-2 font-mono text-xs text-white">
          <div>
            elapsed: {((debugNow - debugStartedAtRef.current) / 1000).toFixed(2)}s
          </div>
          <div>
            animation: {controls.animationDuration.toFixed(2)}s
          </div>
          <div>
            reorientation: {controls.reorientationDuration <= 0
              ? "off"
              : `${controls.reorientationDuration.toFixed(2)}s`}
          </div>
          <div>
            source phase: {(
              (((debugNow - debugStartedAtRef.current) / 1000) %
                controls.animationDuration) /
              controls.animationDuration
            ).toFixed(4)}
          </div>
          <div>
            reorient phase: {controls.reorientationDuration <= 0
              ? "off"
              : (
                  (((debugNow - debugStartedAtRef.current) / 1000) %
                    controls.reorientationDuration) /
                  controls.reorientationDuration
                ).toFixed(4)}
          </div>
          <div>zoom: {zoom_min.toFixed(4)} – {zoom_max.toFixed(4)}</div>
          <div>offset: ({offset_x}, {offset_y})</div>
        </div>
      )}
    </>
  );
}