"use client"

// Settings card with the extension popup's controls, plus where to show the
// toggle. Portaled to <body> (outside the filtered content) so it stays
// readable. One instance is rendered by whichever toggle is active.

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { DAYDREAM_LIMITS, calcFreq, calcSat, type DaydreamMode, type DaydreamPlacement, type DaydreamSettings } from "./engine"
import { setDaydream, setDaydreamPanelOpen } from "./store"
import { CloseIcon } from "./icons"

const MODES: [DaydreamMode, string][] = [
  ["up", "In"],
  ["down", "Out"],
  ["inOut", "In & Out"],
]
const PLACEMENTS: [DaydreamPlacement, string][] = [
  ["navbar", "Navbar"],
  ["floating", "Floating button"],
]

function Segmented<T extends string | boolean>({ options, value, onChange }: {
  options: [T, string][]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="dd-segmented">
      {options.map(([v, name]) => (
        <button key={name} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{name}</button>
      ))}
    </div>
  )
}

export default function DaydreamPanel({ settings, anchor }: { settings: DaydreamSettings; anchor: DaydreamPlacement }) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click (ignoring the toggles that open it) or Escape.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (ref.current?.contains(t) || t?.closest?.("[data-dd-trigger]")) return
      setDaydreamPanelOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDaydreamPanelOpen(false) }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey) }
  }, [])

  return createPortal(
    <div ref={ref} role="dialog" aria-label="Daydream Filter" className="dd-panel" data-anchor={anchor}>
      <div className="dd-panel-head">
        <div>
          <div className="dd-title">Daydream Filter</div>
          <div className="dd-muted">Changes the colors of this page.</div>
        </div>
        <button type="button" className="dd-icon-btn" aria-label="Close" onClick={() => setDaydreamPanelOpen(false)}>
          <CloseIcon />
        </button>
      </div>

      <button type="button" className="dd-power" aria-pressed={settings.enabled} onClick={() => setDaydream({ enabled: !settings.enabled })}>
        {settings.enabled ? "On (click to turn off)" : "Off (click to turn on)"}
      </button>

      <label className="dd-field">
        <span className="dd-row"><span>Rate</span><span>{calcFreq(settings.speed)}</span></span>
        <input type="range" {...DAYDREAM_LIMITS.speed} value={settings.speed}
          onChange={(e) => setDaydream({ speed: Number(e.target.value) })} />
      </label>

      <label className="dd-field">
        <span className="dd-row"><span>Saturation</span><span>{calcSat(settings.saturation)}</span></span>
        <input type="range" {...DAYDREAM_LIMITS.saturation} value={settings.saturation}
          onChange={(e) => setDaydream({ saturation: Number(e.target.value) })} />
      </label>

      <fieldset className="dd-field">
        <legend className="dd-muted">Apply to</legend>
        <Segmented<boolean> options={[[true, "Full page"], [false, "Images & videos"]]} value={settings.isFullPage}
          onChange={(isFullPage) => setDaydream({ isFullPage })} />
      </fieldset>

      <fieldset className="dd-field">
        <legend className="dd-muted">Color changing mode</legend>
        <Segmented<DaydreamMode> options={MODES} value={settings.mode} onChange={(mode) => setDaydream({ mode })} />
      </fieldset>

      {settings.mode === "inOut" ? (
        <label className="dd-field">
          <span className="dd-row"><span># of cycles</span><span>{settings.cpc}</span></span>
          <input type="range" {...DAYDREAM_LIMITS.cpc} value={settings.cpc}
            onChange={(e) => setDaydream({ cpc: Number(e.target.value) })} />
        </label>
      ) : null}

      <fieldset className="dd-field">
        <legend className="dd-muted">Show toggle in</legend>
        <Segmented<DaydreamPlacement> options={PLACEMENTS} value={settings.placement}
          onChange={(placement) => setDaydream({ placement })} />
      </fieldset>

      <p className="dd-note">For a gentler effect, keep saturation at 1 or below. Stop if you feel dizzy or unwell.</p>
    </div>,
    document.body,
  )
}
