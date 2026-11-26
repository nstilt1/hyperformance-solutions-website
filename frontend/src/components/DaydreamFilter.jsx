"use client"

// Floating Daydream Filter control (same controls as the extension popup).
// Mounted inside PhotosensitivityGate, so it only appears after the visitor
// has acknowledged the epilepsy warning. Starts off; settings persist in
// localStorage.

import { useEffect, useRef, useState } from "react"
import { Brain, X } from "lucide-react"
import {
  DAYDREAM_LIMITS,
  calcFreq,
  calcSat,
  loadDaydream,
  normalizeDaydream,
  saveDaydream,
  startDaydream,
} from "@/lib/daydream"

const MODES = [
  ["up", "In"],
  ["down", "Out"],
  ["inOut", "In & Out"],
]

export default function DaydreamFilter() {
  const [settings, setSettings] = useState(null) // null until loaded (client only)
  const [open, setOpen] = useState(false)
  const engine = useRef(null)

  useEffect(() => {
    const initial = loadDaydream()
    setSettings(initial)
    engine.current = startDaydream(initial)
    return () => engine.current?.stop()
  }, [])

  useEffect(() => {
    if (!settings) return
    engine.current?.update(settings)
    saveDaydream(settings)
  }, [settings])

  if (!settings) return null
  const set = (patch) => setSettings((s) => normalizeDaydream({ ...s, ...patch }))

  return (
    <div className="daydream-ui fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 text-sm">
      {open ? (
        <div
          role="dialog"
          aria-label="Daydream Filter"
          className="w-[min(88vw,300px)] rounded-2xl border border-zinc-200 bg-white/95 p-4 text-zinc-800 shadow-xl backdrop-blur"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">Daydream Filter</div>
              <div className="text-xs text-zinc-500">Changes the colors of this page.</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => set({ enabled: !settings.enabled })}
            aria-pressed={settings.enabled}
            className={`mb-4 w-full rounded-xl px-4 py-2 font-medium transition ${
              settings.enabled ? "bg-zinc-900 text-white hover:bg-zinc-700" : "border border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {settings.enabled ? "On (click to turn off)" : "Off (click to turn on)"}
          </button>

          <label className="block">
            <span className="flex justify-between text-xs"><span>Rate</span><span>{calcFreq(settings.speed)}</span></span>
            <input type="range" className="w-full" {...DAYDREAM_LIMITS.speed} value={settings.speed}
              onChange={(e) => set({ speed: Number(e.target.value) })} />
          </label>

          <label className="mt-2 block">
            <span className="flex justify-between text-xs"><span>Saturation</span><span>{calcSat(settings.saturation)}</span></span>
            <input type="range" className="w-full" {...DAYDREAM_LIMITS.saturation} value={settings.saturation}
              onChange={(e) => set({ saturation: Number(e.target.value) })} />
          </label>

          <fieldset className="mt-3">
            <legend className="text-xs text-zinc-500">Apply to</legend>
            <div className="mt-1 flex gap-2">
              {[[true, "Full page"], [false, "Images & videos"]].map(([value, name]) => (
                <button key={name} type="button" onClick={() => set({ isFullPage: value })}
                  className={`flex-1 rounded-lg border px-2 py-1 text-xs ${settings.isFullPage === value ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 hover:bg-zinc-50"}`}>
                  {name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-3">
            <legend className="text-xs text-zinc-500">Color changing mode</legend>
            <div className="mt-1 flex gap-2">
              {MODES.map(([value, name]) => (
                <button key={value} type="button" onClick={() => set({ mode: value })}
                  className={`flex-1 rounded-lg border px-2 py-1 text-xs ${settings.mode === value ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 hover:bg-zinc-50"}`}>
                  {name}
                </button>
              ))}
            </div>
          </fieldset>

          {settings.mode === "inOut" ? (
            <label className="mt-3 block">
              <span className="flex justify-between text-xs"><span># of cycles</span><span>{settings.cpc}</span></span>
              <input type="range" className="w-full" {...DAYDREAM_LIMITS.cpc} value={settings.cpc}
                onChange={(e) => set({ cpc: Number(e.target.value) })} />
            </label>
          ) : null}

          <p className="mt-3 text-[11px] leading-snug text-zinc-500">
            For a gentler effect, keep saturation at 1 or below. Stop if you feel dizzy or unwell.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Daydream Filter settings"
        className={`flex h-12 items-center gap-2 rounded-full px-4 shadow-lg transition ${
          settings.enabled ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
        }`}
      >
        <Brain className="h-5 w-5" />
        <span className="font-medium">Daydream{settings.enabled ? " on" : ""}</span>
      </button>
    </div>
  )
}
