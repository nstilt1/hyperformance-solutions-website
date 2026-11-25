// Tiny external store that drives the photosensitivity screen's progress bar.
// Adapted from abc-private's siteLoadingStore, trimmed to what this site loads
// (no product customizer, no background shader warmup).
//
// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

/** @typedef {"pending" | "ready" | "fallback"} Status */

const initial = {
  route: "",
  // Renderer WASM. `downloadFraction` gives the bar sub-phase granularity.
  phases: { download: "pending", compile: "pending", page: "pending" },
  downloadFraction: 0,
  // Per-page tasks (e.g. the hero animation) registered while mounted.
  tasks: {},
}

let snapshot = initial
const listeners = new Set()

function publish(next) {
  snapshot = next
  listeners.forEach((l) => l())
}

export const subscribeSiteLoading = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const getSiteLoadingSnapshot = () => snapshot
export const getServerLoadingSnapshot = () => initial

export function enterLoadingRoute(route) {
  if (snapshot.route === route) return
  publish({ ...snapshot, route, tasks: {}, phases: { ...snapshot.phases, page: "pending" } })
}

export function setLoadingPhase(phase, status) {
  if (snapshot.phases[phase] !== status) {
    publish({ ...snapshot, phases: { ...snapshot.phases, [phase]: status } })
  }
}

export function setDownloadFraction(fraction) {
  const f = Math.max(0, Math.min(1, fraction))
  if (Math.abs(f - snapshot.downloadFraction) >= 0.01 || f === 1) {
    publish({ ...snapshot, downloadFraction: f })
  }
}

/** Register a page task; returns `finish(status)`. */
export function beginLoadingTask(id, label) {
  if (typeof window === "undefined") return () => {}
  publish({ ...snapshot, tasks: { ...snapshot.tasks, [id]: { label, status: "pending" } } })
  return (status = "ready") => {
    if (!snapshot.tasks[id]) return
    publish({ ...snapshot, tasks: { ...snapshot.tasks, [id]: { label, status } } })
  }
}

export function forgetLoadingTask(id) {
  if (!snapshot.tasks[id]) return
  const tasks = { ...snapshot.tasks }
  delete tasks[id]
  publish({ ...snapshot, tasks })
}

export const LOADING_PHASE_LABELS = {
  download: "Downloading animation renderer",
  compile: "Compiling WebAssembly",
  page: "Loading page images and fonts",
}

export function loadingReadiness(value) {
  const entries = [
    ...Object.entries(value.phases).map(([k, s]) => ({
      status: s,
      weight: k === "download" ? 3 : 1,
      partial: k === "download" && s === "pending" ? value.downloadFraction : 0,
    })),
    ...Object.values(value.tasks).map((t) => ({ status: t.status, weight: 1, partial: 0 })),
  ]
  const total = entries.reduce((a, e) => a + e.weight, 0)
  const done = entries.reduce(
    (a, e) => a + (e.status !== "pending" ? e.weight : e.weight * e.partial),
    0,
  )
  const statuses = entries.map((e) => e.status)
  return {
    percent: Math.round((done / total) * 100),
    ready: statuses.every((s) => s !== "pending"),
    fallback: statuses.includes("fallback"),
  }
}
