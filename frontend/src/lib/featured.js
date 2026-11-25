// featured_data.json schema, defaults, and normalization.
//
// MIRRORED FILE: an identical copy lives in the dashboard branch at
// `frontend/src/lib/featured.js`. Keep both in sync (see AGENTS.md).
//
// ── Why durations are multiples of π ──────────────────────────────────────
// The hero animation is a sum of periodic motions (source/zoom/rotation on the
// base duration, plus reorientation and radius on their own periods). The
// whole picture only repeats when every period lines up, i.e. when their
// ratios are rational. The base duration is a whole number of seconds and the
// secondary periods are (rational) multiples of π, so base : secondary is
// irrational and the combined animation never repeats. Do not express the base
// duration in π, or the secondary periods in plain seconds — that reintroduces
// a finite loop.

export const PI = Math.PI

export const ANIMATION_FNS = ["linear", "triangle", "saw", "sin", "sin2", "cos", "-cos"]
export const BUTTON_VARIANTS = ["primary", "secondary"]
export const SIDE_TYPES = ["text", "image"]

export const DEFAULT_ANIMATION = {
  // Whole seconds (rational). Drives zoom + rotation cycles.
  baseDurationSeconds: 120,
  // Multiples of π seconds.
  reorientationPi: 48,
  reorientationFn: "linear",
  radiusPi: 20,
  radiusDepth: 0.28,
  radiusFn: "triangle",
  // Degrees, 0–359.
  hueShift: 205,
  // Seconds to fast-forward the animation so it starts somewhere different
  // from the Altered Brain Chemistry hero (applied to zoom, rotation, and
  // reorientation phases).
  timeOffsetSeconds: 41,
  recolor: {
    enabled: false,
    seed: "hyperformance",
    mode: 0,
    threshold: 0.08,
    cellSize: 64,
  },
}

export const DEFAULT_HERO = {
  title: "Materializing dreams",
  subtitle: "We've worked on our dreams, but we want to work on yours too.",
  buttons: [
    { label: "View portfolio", href: "/portfolio", variant: "primary" },
    { label: "Contact us", href: "/contact", variant: "secondary" },
  ],
  animation: DEFAULT_ANIMATION,
}

export const DEFAULT_FEATURED = {
  version: 1,
  hero: DEFAULT_HERO,
  projects: [],
}

export function newFeaturedProject() {
  return {
    id: `featured-${Date.now().toString(36)}`,
    left: { type: "text", title: "Project title", subtext: "" },
    right: { type: "image", imagePath: "", imageAlt: "" },
    button: null,
    dividerAbove: true,
    dividerBelow: false,
    dividerBetween: false,
    mobileOrder: "left-first",
  }
}

// ── normalization helpers ─────────────────────────────────────────────────

function str(v, fallback = "") {
  return typeof v === "string" ? v : fallback
}

function num(v, fallback, min = -Infinity, max = Infinity) {
  const n = typeof v === "number" ? v : Number(v)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function oneOf(v, options, fallback) {
  return options.includes(v) ? v : fallback
}

function bool(v, fallback) {
  return typeof v === "boolean" ? v : fallback
}

function normalizeButton(b) {
  if (!b || typeof b !== "object") return null
  const label = str(b.label).trim()
  const href = str(b.href).trim()
  if (!label || !href) return null
  return { label, href, variant: oneOf(b.variant, BUTTON_VARIANTS, "primary") }
}

// The kaleidoscope's raw source image must never be displayed anywhere; it is
// only ever fed to the renderer. Any image path pointing at it is dropped.
export const HIDDEN_SOURCE_IMAGES = ["og-pink-flower-comp-3"]

export function isHiddenSourceImage(path) {
  const p = String(path || "").toLowerCase()
  return HIDDEN_SOURCE_IMAGES.some((name) => p.includes(name))
}

function normalizeSide(s) {
  const side = s && typeof s === "object" ? s : {}
  const type = oneOf(side.type, SIDE_TYPES, "text")
  if (type === "image") {
    const imagePath = str(side.imagePath)
    return { type, imagePath: isHiddenSourceImage(imagePath) ? "" : imagePath, imageAlt: str(side.imageAlt) }
  }
  return { type, title: str(side.title), subtext: str(side.subtext) }
}

export function normalizeAnimation(a) {
  const src = a && typeof a === "object" ? a : {}
  const d = DEFAULT_ANIMATION
  const rc = src.recolor && typeof src.recolor === "object" ? src.recolor : {}
  return {
    // Integer seconds keeps the base period rational.
    baseDurationSeconds: Math.round(num(src.baseDurationSeconds, d.baseDurationSeconds, 5, 600)),
    // 0 disables the motion; otherwise any positive multiple of π.
    reorientationPi: num(src.reorientationPi, d.reorientationPi, 0, 320),
    reorientationFn: oneOf(src.reorientationFn, ANIMATION_FNS, d.reorientationFn),
    radiusPi: num(src.radiusPi, d.radiusPi, 0, 320),
    radiusDepth: num(src.radiusDepth, d.radiusDepth, 0, 1),
    radiusFn: oneOf(src.radiusFn, ANIMATION_FNS, d.radiusFn),
    hueShift: Math.round(num(src.hueShift, d.hueShift, 0, 359)),
    timeOffsetSeconds: num(src.timeOffsetSeconds, d.timeOffsetSeconds, 0, 100000),
    recolor: {
      enabled: bool(rc.enabled, d.recolor.enabled),
      seed: str(rc.seed, d.recolor.seed),
      mode: Math.round(num(rc.mode, d.recolor.mode, 0, 8)),
      threshold: num(rc.threshold, d.recolor.threshold, 0, 1),
      cellSize: Math.round(num(rc.cellSize, d.recolor.cellSize, 4, 512)),
    },
  }
}

export function normalizeFeatured(raw) {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
  const hero = src.hero && typeof src.hero === "object" ? src.hero : {}
  const buttons = Array.isArray(hero.buttons)
    ? hero.buttons.map(normalizeButton).filter(Boolean)
    : DEFAULT_HERO.buttons

  return {
    version: 1,
    hero: {
      title: str(hero.title, DEFAULT_HERO.title),
      subtitle: str(hero.subtitle, DEFAULT_HERO.subtitle),
      buttons,
      animation: normalizeAnimation(hero.animation),
    },
    projects: Array.isArray(src.projects)
      ? src.projects.map((p, i) => {
          const proj = p && typeof p === "object" ? p : {}
          return {
            id: str(proj.id) || `featured-${i}`,
            left: normalizeSide(proj.left),
            right: normalizeSide(proj.right),
            button: normalizeButton(proj.button),
            dividerAbove: bool(proj.dividerAbove, true),
            dividerBelow: bool(proj.dividerBelow, false),
            dividerBetween: bool(proj.dividerBetween, false),
            mobileOrder: oneOf(proj.mobileOrder, ["left-first", "right-first"], "left-first"),
          }
        })
      : [],
  }
}

/** Seconds for a π-multiple setting (0 = off). */
export function piSeconds(multiple) {
  return multiple > 0 ? multiple * PI : 0
}
