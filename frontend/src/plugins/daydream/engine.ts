// Daydream Filter plugin: math, settings, and animation engine.
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
//
// Portable: no framework or app imports. See README.md.

export type DaydreamMode = "up" | "down" | "inOut"
export type DaydreamPlacement = "navbar" | "floating"

export interface DaydreamSettings {
  enabled: boolean
  /** Rate slider: 0.5 .. 40, step 0.1 */
  speed: number
  /** Saturation slider: 0 .. 10, step 0.01 */
  saturation: number
  /** true = whole page content, false = images, videos, iframes, canvases */
  isFullPage: boolean
  /** "up" (In) | "down" (Out) | "inOut" (In & Out) */
  mode: DaydreamMode
  /** Cycles per In & Out swing: 1 .. 8 */
  cpc: number
  /** Where the toggle is shown */
  placement: DaydreamPlacement
}

export interface DaydreamConfig {
  /** Element that full-page mode filters. Plugin UI must live outside it. Falls back to <body>. */
  contentSelector: string
  /** localStorage key for the visitor's settings. */
  storageKey: string
  /** Public URL of the brain image (copy brain.png into your public folder). */
  brainSrc: string
  /** Settings for first-time visitors. */
  defaults: DaydreamSettings
}

/** Extension defaults (popup.js first-run values), except it starts off. */
export const DAYDREAM_DEFAULTS: DaydreamSettings = {
  enabled: false,
  speed: 0.5,
  saturation: 4.2,
  isFullPage: true,
  mode: "inOut",
  cpc: 1,
  placement: "floating",
}

export const DAYDREAM_LIMITS = {
  speed: { min: 0.5, max: 40, step: 0.1 },
  saturation: { min: 0, max: 10, step: 0.01 },
  cpc: { min: 1, max: 8, step: 1 },
} as const

export const DAYDREAM_MODES: DaydreamMode[] = ["up", "down", "inOut"]
export const DAYDREAM_PLACEMENTS: DaydreamPlacement[] = ["navbar", "floating"]

const config: DaydreamConfig = {
  contentSelector: "[data-site-content]",
  storageKey: "daydream-filter:v1",
  brainSrc: "/plugins/daydream/brain.png",
  defaults: DAYDREAM_DEFAULTS,
}

/** Call once (e.g. where the plugin is registered) to adapt it to a host site. */
export function configureDaydream(options: Partial<DaydreamConfig>): void {
  Object.assign(config, options)
}

export function daydreamConfig(): Readonly<DaydreamConfig> {
  return config
}

// ── Verbatim from the extension ───────────────────────────────────────────
/* eslint-disable */

export function calcSat(saturation: number | string): number | string {
  if (saturation == 0.0) return 0
  var sat = parseFloat(String(saturation))
  // max = 10ish
  //var result = 42*Math.pow(Math.E, (Math.sqrt(sat*3)*sat*210/(200*(sat+6)) - 5)) - (42*Math.pow(Math.E, -5));

  // max = 8
  var result = 42*Math.pow(Math.E, (Math.sqrt(sat*69+69)*sat*420/(2000*(sat+7.134401764)) - 5)) - (42*Math.pow(Math.E, -5));
  return (Math.round(result*100)/100).toFixed(2)
}

export function calcSpeed(speed: number): number {
  return 42 * Math.pow(Math.E, (420 * speed * Math.sqrt(69*speed+69))/(2819*(1.37*speed+9.13271534319))-5)-42*Math.pow(Math.E, -5) + 0.01
}

export function calcFreq(speed: number): string {
  return (Math.round(calcSpeed(speed)*5) / 100).toFixed(2) + " cycles/second"
}

/** Seconds per animation period (popup.js `animationDuration`). */
export function animationDuration(s: DaydreamSettings): number {
  var d = 20 / calcSpeed(s.speed)
  if (s.mode == "inOut") d *= s.cpc * 2
  return d
}

/** Hue in degrees for a phase 0..1 (popup.js `currentHue`). */
export function currentHue(s: DaydreamSettings, huePhase: number): number {
  if (s.mode == "inOut") {
    var t = huePhase < 0.5 ? huePhase * 2 : (1 - huePhase) * 2
    return 360 * s.cpc * t
  }
  if (s.mode == "down") return 360 * (1 - huePhase)
  return 360 * huePhase
}

/* eslint-enable */

// ── Settings ──────────────────────────────────────────────────────────────

function clamp(n: unknown, { min, max }: { min: number; max: number }, fallback: number): number {
  const v = Number(n)
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
}

export function normalizeDaydream(raw: unknown): DaydreamSettings {
  const s = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof DaydreamSettings, unknown>>
  const d = config.defaults
  return {
    enabled: typeof s.enabled === "boolean" ? s.enabled : d.enabled,
    speed: clamp(s.speed, DAYDREAM_LIMITS.speed, d.speed),
    saturation: clamp(s.saturation, DAYDREAM_LIMITS.saturation, d.saturation),
    isFullPage: typeof s.isFullPage === "boolean" ? s.isFullPage : d.isFullPage,
    mode: DAYDREAM_MODES.includes(s.mode as DaydreamMode) ? (s.mode as DaydreamMode) : d.mode,
    cpc: Math.round(clamp(s.cpc, DAYDREAM_LIMITS.cpc, d.cpc)),
    placement: DAYDREAM_PLACEMENTS.includes(s.placement as DaydreamPlacement)
      ? (s.placement as DaydreamPlacement)
      : d.placement,
  }
}

export function loadDaydream(): DaydreamSettings {
  try {
    return normalizeDaydream(JSON.parse(localStorage.getItem(config.storageKey) || "null"))
  } catch {
    return normalizeDaydream(null)
  }
}

export function saveDaydream(settings: DaydreamSettings): void {
  try { localStorage.setItem(config.storageKey, JSON.stringify(settings)) } catch { /* storage disabled */ }
}

// ── Engine ────────────────────────────────────────────────────────────────

export interface DaydreamEngine {
  update(settings: DaydreamSettings): void
  stop(): void
}

/**
 * Starts the animation loop. `update` changes settings live: the phase
 * carries over, so speeding up or switching mode doesn't jump back to the
 * start of the cycle.
 */
export function startDaydream(initial: DaydreamSettings): DaydreamEngine {
  const root = document.documentElement
  let settings = normalizeDaydream(initial)
  let huePhase = 0 // progress through one animation period, 0..1
  let lastFrame: number | null = null
  let raf = 0
  let target: Element | null = null

  // The filtered element is marked with [data-dd-root]; daydream.css targets it.
  function markTarget() {
    const next = document.querySelector(config.contentSelector) ?? document.body
    if (next !== target) {
      target?.removeAttribute("data-dd-root")
      target = next
      target.setAttribute("data-dd-root", "")
    }
  }

  function apply() {
    if (!settings.enabled) {
      root.removeAttribute("data-daydream")
      root.style.removeProperty("--dd-hue")
      root.style.removeProperty("--dd-sat")
      return
    }
    markTarget()
    root.setAttribute("data-daydream", settings.isFullPage ? "full" : "media")
    root.style.setProperty("--dd-sat", String(calcSat(settings.saturation)))
  }

  function frame(now: number) {
    if (lastFrame != null && settings.enabled) {
      huePhase = (huePhase + (now - lastFrame) / 1000 / animationDuration(settings)) % 1
      root.style.setProperty("--dd-hue", currentHue(settings, huePhase) + "deg")
      if (!target?.isConnected) markTarget() // host swapped its wrapper (e.g. on navigation)
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
      target?.removeAttribute("data-dd-root")
    },
  }
}
