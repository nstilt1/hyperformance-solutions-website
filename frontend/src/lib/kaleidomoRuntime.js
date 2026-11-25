// Loads the kaleidomo renderer once per page runtime: streams the WASM binary
// (reporting progress), compiles it, caches the bytes in CacheStorage for the
// next visit, and initializes the wasm-bindgen JS glue on the main thread.
//
// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

import { setDownloadFraction, setLoadingPhase } from "@/lib/siteLoadingStore"

// Bump when public/wasm/* is replaced so browsers drop the cached binary.
export const KALEIDOMO_WASM_VERSION = "750c779e4e91"
const WASM_JS_URL = `/wasm/kaleidomo_core.js?v=${KALEIDOMO_WASM_VERSION}`
const WASM_BIN_PATH = `/wasm/kaleidomo_core_bg.wasm?v=${KALEIDOMO_WASM_VERSION}`
const CACHE_NAME = `hf-renderer-${KALEIDOMO_WASM_VERSION}`
// Uncompressed size, used when the server omits/compresses Content-Length.
const APPROX_WASM_BYTES = 675_415

let compiledPromise = null
let bindingsPromise = null

async function openCache() {
  try {
    if (typeof caches === "undefined") return null
    return await caches.open(CACHE_NAME)
  } catch {
    return null
  }
}

async function readWithProgress(response) {
  const reader = response.body?.getReader()
  if (!reader) return new Uint8Array(await response.arrayBuffer())
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.byteLength
    setDownloadFraction(received / APPROX_WASM_BYTES)
  }
  const bytes = new Uint8Array(received)
  let offset = 0
  for (const c of chunks) {
    bytes.set(c, offset)
    offset += c.byteLength
  }
  return bytes
}

export function getCompiledKaleidomo() {
  compiledPromise ??= (async () => {
    const url = new URL(WASM_BIN_PATH, window.location.origin).href
    const cache = await openCache()
    let cached
    try { cached = await cache?.match(url) } catch { /* storage unavailable */ }
    if (cached) {
      try {
        const bytes = await cached.arrayBuffer()
        setDownloadFraction(1)
        setLoadingPhase("download", "ready")
        const mod = await WebAssembly.compile(bytes)
        setLoadingPhase("compile", "ready")
        return mod
      } catch {
        try { await cache?.delete(url) } catch { /* fall through to network */ }
      }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45_000)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`Renderer WASM request failed (${response.status})`)
      const bytes = await readWithProgress(response)
      setDownloadFraction(1)
      setLoadingPhase("download", "ready")
      // Compile before caching: a 200 could still be an HTML error page.
      const mod = await WebAssembly.compile(bytes)
      setLoadingPhase("compile", "ready")
      if (cache) {
        void cache
          .put(url, new Response(bytes, { headers: { "Content-Type": "application/wasm" } }))
          .catch(() => {})
      }
      return mod
    } finally {
      clearTimeout(timer)
    }
  })().catch((error) => {
    compiledPromise = null
    setLoadingPhase("download", "fallback")
    setLoadingPhase("compile", "fallback")
    throw error
  })
  return compiledPromise
}

/** wasm-bindgen module with `LiveKaleidoscopeEngine` / `WasmVideoSettings`. */
export function getKaleidomoBindings() {
  bindingsPromise ??= (async () => {
    const [bindings, compiled] = await Promise.all([
      import(/* webpackIgnore: true */ WASM_JS_URL),
      getCompiledKaleidomo(),
    ])
    await bindings.default({ module_or_path: compiled })
    return bindings
  })().catch((error) => {
    bindingsPromise = null
    throw error
  })
  return bindingsPromise
}

/** True when this browser can plausibly run the WebGPU renderer. */
export function rendererSupported() {
  return typeof navigator !== "undefined" && "gpu" in navigator && typeof WebAssembly === "object"
}
