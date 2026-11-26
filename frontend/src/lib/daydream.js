// Daydream Filter, built into the site.
//
// Ported from the Daydream Filter browser extension (Copyright 2023 - Noah
// Stiltner; `Daydream-Filter/daydream.js` + `popup.js`). The extension
// injects a CSS @keyframes animation into every page. Here it runs on one tab,
// so a requestAnimationFrame loop advances a phase and writes `--dd-hue` /
// `--dd-sat` on <html>, the same way the extension's popup previews itself.
// Rate changes apply instantly without restarting the cycle.
//
// The slider-to-effect curves (calcSat / calcSpeed / calcFreq) are copied
// verbatim, constants and all. Don't "simplify" them: the odd numbers
// (69, 420, 2819, 7.134401764, 9.13271534319, ...) shape how the sliders feel.

export const DAYDREAM_STORAGE_KEY = "hf:daydream:v1"

/** Extension defaults (popup.js first-run values), except it starts off. */
export const DAYDREAM_DEFAULTS = {
  enabled: false,
  speed: 0.5, // slider: 0.5 .. 40, step 0.1
  saturation: 4.2, // slider: 0 .. 10, step 0.01
  isFullPage: true, // true = whole page, false = images, videos, iframes
  mode: "inOut", // "up" (In) | "down" (Out) | "inOut" (In & Out)
  cpc: 1, // cycles per In & Out swing: 1 .. 8
}

export const DAYDREAM_LIMITS = {
  speed: { min: 0.5, max: 40, step: 0.1 },
  saturation: { min: 0, max: 10, step: 0.01 },
  cpc: { min: 1, max: 8, step: 1 },
}

// ── Verbatim from the extension ───────────────────────────────────────────

export function calcSat(saturation) {
  if (saturation == 0.0) return 0
  var sat = parseFloat(saturation)
  // max = 10ish
  //var result = 42*Math.pow(Math.E, (Math.sqrt(sat*3)*sat*210/(200*(sat+6)) - 5)) - (42*Math.pow(Math.E, -5));

  // max = 8
  var result = 42*Math.pow(Math.E, (Math.sqrt(sat*69+69)*sat*420/(2000*(sat+7.134401764)) - 5)) - (42*Math.pow(Math.E, -5));
  return (Math.round(result*100)/100).toFixed(2)
}

export function calcSpeed(speed) {
  return 42 * Math.pow(Math.E, (420 * speed * Math.sqrt(69*speed+69))/(2819*(1.37*speed+9.13271534319))-5)-42*Math.pow(Math.E, -5) + 0.01
}

export function calcFreq(speed) {
  return (Math.round(calcSpeed(speed)*5) / 100).toFixed(2) + " cycles/second"
}

/** Seconds per animation period (popup.js `animationDuration`). */
export function animationDuration(s) {
  var d = 20 / calcSpeed(s.speed)
  if (s.mode == "inOut") d *= s.cpc * 2
  return d
}

/** Hue in degrees for a phase 0..1 (popup.js `currentHue`). */
export function currentHue(s, huePhase) {
  if (s.mode == "inOut") {
    var t = huePhase < 0.5 ? huePhase * 2 : (1 - huePhase) * 2
    return 360 * s.cpc * t
  }
  if (s.mode == "down") return 360 * (1 - huePhase)
  return 360 * huePhase
}

// ── Settings ──────────────────────────────────────────────────────────────

function clamp(n, { min, max }, fallback) {
  const v = Number(n)
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
}

export function normalizeDaydream(raw) {
  const s = raw && typeof raw === "object" ? raw : {}
  const d = DAYDREAM_DEFAULTS
  return {
    enabled: typeof s.enabled === "boolean" ? s.enabled : d.enabled,
    speed: clamp(s.speed, DAYDREAM_LIMITS.speed, d.speed),
    saturation: clamp(s.saturation, DAYDREAM_LIMITS.saturation, d.saturation),
    isFullPage: typeof s.isFullPage === "boolean" ? s.isFullPage : d.isFullPage,
    mode: ["up", "down", "inOut"].includes(s.mode) ? s.mode : d.mode,
    cpc: Math.round(clamp(s.cpc, DAYDREAM_LIMITS.cpc, d.cpc)),
  }
}

export function loadDaydream() {
  try {
    return normalizeDaydream(JSON.parse(localStorage.getItem(DAYDREAM_STORAGE_KEY) || "null"))
  } catch {
    return normalizeDaydream(null)
  }
}

export function saveDaydream(settings) {
  try { localStorage.setItem(DAYDREAM_STORAGE_KEY, JSON.stringify(settings)) } catch { /* storage disabled */ }
}

// ── Engine ────────────────────────────────────────────────────────────────

/**
 * Starts the animation loop. Returns `{ update(settings), stop() }`.
 * `update` changes settings live: the phase carries over, so speeding up or
 * switching mode doesn't jump back to the start of the cycle.
 */
export function startDaydream(initial) {
  const root = document.documentElement
  let settings = normalizeDaydream(initial)
  let huePhase = 0 // progress through one animation period, 0..1
  let lastFrame = null
  let raf = 0

  function apply() {
    if (!settings.enabled) {
      root.removeAttribute("data-daydream")
      root.style.removeProperty("--dd-hue")
      root.style.removeProperty("--dd-sat")
      return
    }
    root.setAttribute("data-daydream", settings.isFullPage ? "full" : "media")
    root.style.setProperty("--dd-sat", String(calcSat(settings.saturation)))
  }

  function frame(now) {
    if (lastFrame != null && settings.enabled) {
      huePhase = (huePhase + (now - lastFrame) / 1000 / animationDuration(settings)) % 1
      root.style.setProperty("--dd-hue", currentHue(settings, huePhase) + "deg")
    }
    lastFrame = now
    raf = requestAnimationFrame(frame)
  }

  apply()
  raf = requestAnimationFrame(frame)

  return {
    update(next) {
      settings = normalizeDaydream(next)
      apply()
    },
    stop() {
      cancelAnimationFrame(raf)
      settings = { ...settings, enabled: false }
      apply()
    },
  }
}
