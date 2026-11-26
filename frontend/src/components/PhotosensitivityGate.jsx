"use client"

// Epilepsy/photosensitivity warning + loading progress, adapted from
// abc-private and rebranded for Hyperformance Solutions LLC.

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import {
  LOADING_PHASE_LABELS,
  enterLoadingRoute,
  getServerLoadingSnapshot,
  getSiteLoadingSnapshot,
  loadingReadiness,
  setLoadingPhase,
  subscribeSiteLoading,
} from "@/lib/siteLoadingStore"
import { getCompiledKaleidomo, rendererSupported } from "@/lib/kaleidomoRuntime"
import DaydreamFilter from "@/components/DaydreamFilter"

const ACKNOWLEDGMENT_KEY = "hf:photosensitivity-acknowledged:v1"

// Dev-only: `?warningPreview=1` shows the screen without touching storage.
function previewWarning() {
  return (
    process.env.NODE_ENV !== "production" &&
    new URLSearchParams(window.location.search).get("warningPreview") === "1"
  )
}

/** Tracks "page" readiness: fonts + visible images inside the site content. */
function usePageReadiness(pathname) {
  useEffect(() => {
    enterLoadingRoute(pathname)
    let cancelled = false
    let generation = 0
    let timer
    const scan = () => {
      const current = ++generation
      const images = Array.from(document.querySelectorAll("[data-site-content] img")).filter((img) => {
        const r = img.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0
      })
      if (images.some((img) => !img.complete)) setLoadingPhase("page", "pending")
      void Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        ...images.map((img) => img.decode().catch(() => {})),
      ]).then(() => {
        if (!cancelled && current === generation && getSiteLoadingSnapshot().route === pathname) {
          setLoadingPhase("page", "ready")
        }
      })
    }
    const schedule = () => { clearTimeout(timer); timer = setTimeout(scan, 120) }
    const observer = new MutationObserver(schedule)
    const content = document.querySelector("[data-site-content]")
    if (content) observer.observe(content, { childList: true, subtree: true })
    schedule()
    return () => { cancelled = true; clearTimeout(timer); observer.disconnect() }
  }, [pathname])
}

export default function PhotosensitivityGate({ children }) {
  const pathname = usePathname() ?? "/"
  const state = useSyncExternalStore(subscribeSiteLoading, getSiteLoadingSnapshot, getServerLoadingSnapshot)
  const { percent, fallback } = loadingReadiness(state)
  const [acknowledged, setAcknowledged] = useState(false)
  const continueRef = useRef(null)
  const contentRef = useRef(null)

  usePageReadiness(pathname)

  const pendingPhase = Object.keys(LOADING_PHASE_LABELS).find((p) => state.phases[p] === "pending")
  const pendingTask = Object.values(state.tasks).find((t) => t.status === "pending")
  const label = pendingPhase
    ? LOADING_PHASE_LABELS[pendingPhase]
    : pendingTask?.label ?? (fallback ? "Page ready · animation shown as video" : "Page ready")

  useEffect(() => {
    // Start downloading the renderer while the visitor reads the warning.
    if (rendererSupported()) {
      void getCompiledKaleidomo().catch(() => {})
    } else {
      setLoadingPhase("download", "fallback")
      setLoadingPhase("compile", "fallback")
    }
    try {
      if (!previewWarning() && localStorage.getItem(ACKNOWLEDGMENT_KEY) === "yes") {
        setAcknowledged(true)
        return
      }
    } catch { /* storage disabled; acknowledgment still works in memory */ }
    continueRef.current?.focus({ preventScroll: true })
  }, [])

  // React 18 has no `inert` prop; toggle the DOM attribute directly.
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (acknowledged) el.removeAttribute("inert")
    else el.setAttribute("inert", "")
  }, [acknowledged])

  useEffect(() => {
    if (acknowledged) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [acknowledged])

  function acknowledge() {
    try { if (!previewWarning()) localStorage.setItem(ACKNOWLEDGMENT_KEY, "yes") } catch { /* keep visit usable */ }
    setAcknowledged(true)
    requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: true }))
  }

  return (
    <>
      <div
        data-site-content
        ref={contentRef}
        aria-hidden={!acknowledged ? true : undefined}
        tabIndex={-1}
        className="outline-none"
      >
        {children}
      </div>
      {/* Outside the content wrapper so full-page Daydream doesn't recolor its own controls. */}
      {acknowledged ? <DaydreamFilter /> : null}
      {!acknowledged && (
        <div
          className="photosensitivity-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="photosensitivity-title"
          aria-describedby="photosensitivity-description"
          onKeyDown={(e) => {
            if (e.key !== "Tab") return
            const controls = e.currentTarget.querySelectorAll("button, a[href]")
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
          }}
        >
          <section className="photosensitivity-card">
            <p className="photosensitivity-eyebrow">HYPERFORMANCE SOLUTIONS LLC · BEFORE YOU ENTER</p>
            <div className="photosensitivity-symbol" aria-hidden="true">!</div>
            <h1 id="photosensitivity-title">Epilepsy &amp;<br />photosensitivity warning</h1>
            <p id="photosensitivity-description">
              This site includes rapidly changing colors and moving kaleidoscopic patterns. These visuals
              may trigger seizures or cause discomfort for people with photosensitive epilepsy or other
              visual sensitivities.
            </p>
            <p>If these effects could affect you, leave the site without viewing them.</p>
            <div className="photosensitivity-loading">
              <div className="photosensitivity-loading-label">
                <span aria-live="polite">{label}</span>
                <span>{percent}%</span>
              </div>
              <progress aria-label="Page loading progress" max={100} value={percent} />
              <small>Only the homepage animation renderer is downloaded. It is cached for your next visit.</small>
            </div>
            <div className="photosensitivity-actions">
              <button ref={continueRef} type="button" onClick={acknowledge}>I understand — enter site</button>
              <a href="https://www.google.com/" rel="noreferrer">Leave site</a>
            </div>
            <p className="photosensitivity-note">The page loads in the background. Enter whenever you’re ready.</p>
            <noscript>JavaScript is required to acknowledge this warning and enter the site.</noscript>
          </section>
        </div>
      )}
    </>
  )
}
