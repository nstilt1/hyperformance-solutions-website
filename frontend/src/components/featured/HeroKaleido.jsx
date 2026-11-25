"use client"

// Main-thread port of abc-private's HeroVideo. Only the hero renderer is
// loaded (no worker pool, no product-customizer shaders).
//
// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

import { useEffect, useRef, useState } from "react"
import { getKaleidomoBindings, rendererSupported } from "@/lib/kaleidomoRuntime"
import { beginLoadingTask, forgetLoadingTask } from "@/lib/siteLoadingStore"
import { normalizeAnimation, piSeconds } from "@/lib/featured"

// Proxied through a Next.js rewrite so the WASM fetch stays same-origin.
const SOURCE_IMAGE_URL = "/wasm-assets/og-pink-flower-comp-3.jpg"
const POSTER_URL = "https://cdn.hyperformancesolutions.com/media/images/kaleidomo-first-frame.jpg"
const FALLBACK_VIDEO_URL = "https://cdn.hyperformancesolutions.com/media/output-wv1-720-8.mp4"

const FPS = 24
const ZOOM_MAX = 0.9090958991783823
const ZOOM_MIN = 0.85
const OFFSET_X = 354
const OFFSET_Y = 0
const KALEIDO_TYPE_IDX = 3
const NUM_ZOOM_LOOPS = 4
const ROTATION_CYCLES = 1
const INIT_TIMEOUT_MS = 30_000

// Base triangle placement on the hero circle (orientation 0).
function baseTriangle() {
  const leftX = 515.1039592844847
  const rightX = 1547
  const centerY = 755.3734001945962
  const centerX = (leftX + rightX) / 2
  const radius = (rightX - leftX) / 2
  const circleAngle = Math.PI
  const rot = 6.22 + (circleAngle - Math.PI)
  return {
    x: centerX + Math.cos(circleAngle) * radius,
    y: centerY + Math.sin(circleAngle) * radius,
    rot: ((rot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2),
  }
}

// Start offsets in the renderer are phase fractions (cycles), so a time
// offset T maps to T × (cycles per second) for each time-driven channel.
function applyVideoSettings(vs, a) {
  const base = a.baseDurationSeconds
  const reorient = piSeconds(a.reorientationPi)
  const radius = piSeconds(a.radiusPi)
  const t = a.timeOffsetSeconds

  vs.animation_duration = base

  vs.hue_range = 0
  vs.hue_cycles = 0
  vs.hue_start_offset = 0
  vs.set_hue_fn("-cos")

  vs.rotation_range = 45
  vs.rotation_cycles = ROTATION_CYCLES
  vs.rotation_start_offset = (t * ROTATION_CYCLES) / base
  vs.set_rotation_fn("sin2")

  vs.zoom_max = ZOOM_MAX
  vs.zoom_min = ZOOM_MIN
  vs.zoom_start_offset = (t * NUM_ZOOM_LOOPS) / base
  vs.num_zoom_loops = NUM_ZOOM_LOOPS
  vs.set_zoom_fn("sin")

  vs.orientation_range = 1
  vs.orientation_cycles = reorient <= 0 ? 0 : 1 / reorient
  vs.orientation_duration = reorient
  vs.orientation_start_offset = reorient <= 0 ? 0 : t / reorient
  vs.set_orientation_fn(a.reorientationFn)

  // The renderer has no radius start offset; radius always starts at phase 0.
  vs.radius_duration = radius
  vs.radius_depth = a.radiusDepth
  vs.set_radius_fn(a.radiusFn)
}

function animationArgs(a, vs) {
  const tri = baseTriangle()
  const rc = a.recolor
  return [
    FPS, OFFSET_X, OFFSET_Y,
    0.069, // zoom
    1.1, // tile count
    tri.x, tri.y, tri.rot,
    KALEIDO_TYPE_IDX,
    a.hueShift,
    rc.enabled, rc.seed, rc.mode, rc.threshold, rc.cellSize,
    vs,
    0, // anti-aliasing level
    true, // derivative mipmapping
    1, // anisotropy
    1, // supersampling
    false, // aspect correction
  ]
}

// React Strict Mode mounts twice; engine create/free must never overlap.
let lifecycleTail = Promise.resolve()
function serialise(fn) {
  const next = lifecycleTail.then(fn).catch(() => {})
  lifecycleTail = next
  return next
}

/**
 * @param {{ animation: object, width?: number, height?: number, trackLoading?: boolean }} props
 * `animation` is a featured_data.json `hero.animation` object.
 */
export default function HeroKaleido({ animation, width = 1920, height = 1080, trackLoading = true }) {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const engineRef = useRef(null)
  const vsRef = useRef(null)
  const animRef = useRef(normalizeAnimation(animation))
  const [fallback, setFallback] = useState(false)
  const [started, setStarted] = useState(false)

  const anim = normalizeAnimation(animation)
  const animKey = JSON.stringify(anim)
  animRef.current = anim

  useEffect(() => {
    if (!fallback) return
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.playsInline = true
    v.play()?.catch(() => {})
  }, [fallback])

  useEffect(() => {
    if (fallback) return
    let cancelled = false
    let ro
    const taskId = "hero-animation"
    const finishTask = trackLoading ? beginLoadingTask(taskId, "Starting hero animation") : () => {}

    const timeout = window.setTimeout(() => fail("renderer init timed out"), INIT_TIMEOUT_MS)

    function fail(reason) {
      if (process.env.NODE_ENV !== "production") console.warn("[HeroKaleido] fallback:", reason)
      window.clearTimeout(timeout)
      finishTask("fallback")
      if (!cancelled) setFallback(true)
    }

    function teardown() {
      const eng = engineRef.current
      const vs = vsRef.current
      engineRef.current = null
      vsRef.current = null
      try { eng?.stop_animation() } catch { /* not started */ }
      try { eng?.free() } catch { /* already freed */ }
      try { vs?.free() } catch { /* already freed */ }
    }

    serialise(async () => {
      if (cancelled) return
      if (!rendererSupported()) return fail("WebGPU unavailable")
      const canvas = canvasRef.current
      if (!canvas) return fail("no canvas")

      const size = () => {
        const w = canvas.parentElement?.getBoundingClientRect().width ?? width
        const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2)
        const rw = Math.max(1, Math.min(width, Math.ceil(w * dpr)))
        return { width: rw, height: Math.round((rw * height) / width) }
      }
      let backing = size()
      canvas.width = backing.width
      canvas.height = backing.height

      let mod
      try { mod = await getKaleidomoBindings() } catch (e) { return fail(e) }
      if (cancelled) return

      try { engineRef.current = await new mod.LiveKaleidoscopeEngine(canvas) } catch (e) { return fail(e) }
      if (cancelled) return teardown()

      try { await engineRef.current.load_image_from_url(SOURCE_IMAGE_URL) } catch (e) { teardown(); return fail(e) }
      if (cancelled) return teardown()

      const vs = new mod.WasmVideoSettings()
      vsRef.current = vs
      applyVideoSettings(vs, animRef.current)
      try {
        engineRef.current.start_animation(...animationArgs(animRef.current, vs))
      } catch (e) { teardown(); return fail(e) }
      if (cancelled) return teardown()

      window.clearTimeout(timeout)
      finishTask("ready")
      setStarted(true)

      if (canvas.parentElement && typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => {
          if (cancelled || !engineRef.current) return
          const next = size()
          if (next.width === backing.width && next.height === backing.height) return
          try { engineRef.current.resize(next.width, next.height); backing = next } catch (e) { teardown(); fail(e) }
        })
        ro.observe(canvas.parentElement)
      }
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      ro?.disconnect()
      if (trackLoading) forgetLoadingTask(taskId)
      serialise(async () => teardown())
    }
  }, [fallback, width, height, trackLoading])

  // Live updates (dashboard preview sliders) without recreating the engine.
  useEffect(() => {
    const eng = engineRef.current
    const vs = vsRef.current
    if (!eng || !vs || fallback) return
    applyVideoSettings(vs, anim)
    try { eng.update_animation_settings(...animationArgs(anim, vs)) } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey, started, fallback])

  const cover =
    "absolute left-1/2 top-1/2 h-full min-h-full min-w-full w-auto -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"

  if (fallback) {
    return (
      <video
        ref={videoRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{ filter: `hue-rotate(${anim.hueShift - 260}deg)` }}
        src={FALLBACK_VIDEO_URL}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />
    )
  }

  const aspect = { aspectRatio: `${width} / ${height}` }
  return (
    <>
      <img
        src={POSTER_URL}
        alt=""
        aria-hidden="true"
        style={{ ...aspect, filter: `hue-rotate(${anim.hueShift - 260}deg)` }}
        className={`${cover} transition-opacity duration-700 ${started ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvasRef} aria-hidden="true" style={aspect} className={cover} />
    </>
  )
}
