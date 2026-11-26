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
export const SIDE_TYPES = ["text", "image", "video", "iframe", "openverse"]
export const ROW_LAYOUTS = ["split", "full"]
export const OPENVERSE_PAGE_SIZES = [12, 20, 30]
export const EMBED_ASPECTS = ["16/9", "4/3", "1/1", "9/16", "auto"]

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
    layout: "split",
    // Used by the full-width layout (heading above the single content block).
    title: "",
    subtext: "",
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
    return {
      type,
      imagePath: isHiddenSourceImage(imagePath) ? "" : imagePath,
      imageAlt: str(side.imageAlt),
      // Same syntax as iframe custom CSS (declarations + @keyframes), applied to the <img>.
      customCss: str(side.customCss),
    }
  }
  if (type === "video") {
    return { type, url: str(side.url), title: str(side.title) }
  }
  if (type === "openverse") {
    return {
      type,
      defaultQuery: str(side.defaultQuery, "psychedelic art"),
      placeholder: str(side.placeholder, "Search openly licensed art…"),
      pageSize: OPENVERSE_PAGE_SIZES.includes(side.pageSize) ? side.pageSize : 20,
      // CC BY-SA requires adaptations (e.g. a filtered version) to carry the
      // same licence, so it's excluded unless explicitly allowed.
      includeShareAlike: bool(side.includeShareAlike, false),
      // Applied to each result image only (declarations + @keyframes).
      customCss: str(side.customCss),
    }
  }
  if (type === "iframe") {
    return {
      type,
      url: str(side.url),
      title: str(side.title),
      aspect: oneOf(side.aspect, EMBED_ASPECTS, "16/9"),
      // Only used when aspect is "auto".
      height: Math.round(num(side.height, 480, 100, 2000)),
      customCss: str(side.customCss),
    }
  }
  return { type, title: str(side.title), subtext: str(side.subtext) }
}

// ── embeds ────────────────────────────────────────────────────────────────

/** YouTube video ID from watch / youtu.be / shorts / embed / live URLs, or null. */
export function youtubeId(url) {
  let u
  try { u = new URL(String(url || "").trim()) } catch { return null }
  const host = u.hostname.replace(/^www\.|^m\./, "")
  let id = null
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0]
  else if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v")
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)
      id = m ? m[1] : null
    }
  }
  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null
}

/** Privacy-enhanced embed URL (keeps a start time if the link had one). */
export function youtubeEmbedUrl(url) {
  const id = youtubeId(url)
  if (!id) return null
  let start = 0
  try {
    const t = new URL(url).searchParams.get("t") || new URL(url).searchParams.get("start") || ""
    const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/)
    if (m) start = (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0)
  } catch { /* no start time */ }
  return `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ""}`
}

/**
 * Instagram post/reel/tv ID from a post link, an /embed/ link, or the pasted
 * embed code (<blockquote data-instgrm-permalink="…">), or null.
 */
export function instagramPostId(input) {
  const m = String(input || "").match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]{5,40})/)
  return m ? { kind: m[1], id: m[2] } : null
}

/** Only https URLs may be embedded. Instagram post links/embed code become the post's /embed/ page. */
export function safeEmbedUrl(url) {
  const ig = instagramPostId(url)
  if (ig) return `https://www.instagram.com/${ig.kind}/${ig.id}/embed/`
  try {
    const u = new URL(String(url || "").trim())
    return u.protocol === "https:" ? u.href : null
  } catch {
    return null
  }
}

// A declaration is kept only if the property is a plain CSS name and the
// value can't break out of a style block or run script.
function cleanDecl(decl) {
  const i = decl.indexOf(":")
  if (i < 1) return null
  const prop = decl.slice(0, i).trim().toLowerCase()
  const value = decl.slice(i + 1).trim().replace(/\s*!important$/i, "")
  if (!/^-?[a-z][a-z-]*$/.test(prop) || !value) return null
  if (/[<>{}\\]|expression\(|javascript:|@import|url\(/i.test(value)) return null
  return [prop, value]
}

function toReactKey(prop) {
  if (prop.startsWith("--")) return prop
  return prop
    .replace(/^-(webkit|moz|ms)-/, (_, v) => `${v[0].toUpperCase()}${v.slice(1)}-`)
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/** Small stable hash so keyframe names are unique per CSS snippet. */
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36)
}

/** Index just past the "}" matching the "{" at `open`, or the end (tolerates missing braces). */
function matchBrace(text, open) {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++
    else if (text[i] === "}" && --depth === 0) return i + 1
  }
  return text.length
}

/**
 * Parses the iframe "custom CSS" box: plain declarations
 * ("border-radius: 16px; filter: saturate(2)") are applied to the frame, and
 * `@keyframes name { … }` blocks become real animations. Keyframe names are
 * prefixed per snippet so embeds can't clash. The returned CSS text is rebuilt
 * from validated pieces only. CSS can only style the frame, not the page
 * inside it (browsers block cross-origin styling).
 *
 * @returns {{ style: object, keyframesCss: string }}
 */
export function parseIframeCss(css) {
  let text = String(css || "").replace(/\/\*[\s\S]*?\*\//g, "")
  const prefix = `hf${hashString(text)}-`
  const renamed = new Map()
  const blocks = []

  const re = /@(?:-webkit-)?keyframes\s+([A-Za-z_][\w-]*)\s*\{/g
  let rest = ""
  let last = 0
  let m
  while ((m = re.exec(text))) {
    const open = m.index + m[0].length - 1
    const end = matchBrace(text, open)
    rest += text.slice(last, m.index)
    last = end
    re.lastIndex = end
    const name = m[1]
    const body = text.slice(open + 1, end).replace(/\}\s*$/, "")
    const stops = []
    const stopRe = /([^{}]+)\{([^{}]*)\}?/g
    let sm
    while ((sm = stopRe.exec(body))) {
      const selector = sm[1].trim().toLowerCase()
      if (!/^(from|to|\d{1,3}(\.\d+)?%)(\s*,\s*(from|to|\d{1,3}(\.\d+)?%))*$/.test(selector)) continue
      const decls = sm[2].split(";").map(cleanDecl).filter(Boolean)
      if (decls.length) stops.push(`${selector}{${decls.map(([p, v]) => `${p}:${v}`).join(";")}}`)
    }
    if (stops.length) {
      renamed.set(name, prefix + name)
      blocks.push(`@keyframes ${prefix}${name}{${stops.join("")}}`)
    }
  }
  rest += text.slice(last)

  const style = {}
  for (const decl of rest.split(";")) {
    const d = cleanDecl(decl)
    if (!d) continue
    let [prop, value] = d
    if (prop === "animation" || prop === "animation-name") {
      value = value.replace(/[A-Za-z_][\w-]*/g, (word) => renamed.get(word) ?? word)
    }
    style[toReactKey(prop)] = value
  }
  return { style, keyframesCss: blocks.join("\n") }
}

/** Declarations-only variant (kept for callers that don't render keyframes). */
export function parseInlineCss(css) {
  return parseIframeCss(css).style
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
            layout: oneOf(proj.layout, ROW_LAYOUTS, "split"),
            title: str(proj.title),
            subtext: str(proj.subtext),
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

// ── Openverse ─────────────────────────────────────────────────────────────

const OPENVERSE_API = "https://api.openverse.org/v1/images/"

/**
 * Search URL limited to licences that allow commercial use and modification
 * (CC BY, CC0, Public Domain Mark; CC BY-SA only when allowed). Openverse
 * already hides results it marks as mature.
 */
export function openverseSearchUrl({ query, page = 1, pageSize = 20, includeShareAlike = false }) {
  const params = new URLSearchParams({
    q: String(query || "").trim(),
    license: includeShareAlike ? "by,by-sa,cc0,pdm" : "by,cc0,pdm",
    page: String(page),
    page_size: String(pageSize),
  })
  return `${OPENVERSE_API}?${params}`
}

/** Human licence label, e.g. "CC BY 2.0", "CC0", "Public domain". */
export function openverseLicenseLabel(result) {
  const lic = String(result?.license || "").toLowerCase()
  if (lic === "cc0") return "CC0"
  if (lic === "pdm") return "Public domain"
  return `CC ${lic.toUpperCase()}${result?.license_version ? ` ${result.license_version}` : ""}`
}
