"use client"

// One shared Daydream state for every piece of the plugin (toggles, panel).
// The animation engine starts on first use in the browser.

import { useSyncExternalStore } from "react"
import {
  loadDaydream,
  normalizeDaydream,
  saveDaydream,
  startDaydream,
  type DaydreamEngine,
  type DaydreamSettings,
} from "./engine"

let settings: DaydreamSettings | null = null
let engine: DaydreamEngine | null = null
const listeners = new Set<() => void>()

function ensureStarted(): void {
  if (settings || typeof window === "undefined") return
  settings = loadDaydream()
  engine = startDaydream(settings)
}

function subscribe(listener: () => void): () => void {
  ensureStarted()
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** Updates settings live, saves them, and notifies every subscriber. */
export function setDaydream(patch: Partial<DaydreamSettings>): void {
  ensureStarted()
  settings = normalizeDaydream({ ...settings, ...patch })
  engine?.update(settings)
  saveDaydream(settings)
  listeners.forEach((l) => l())
}

/** Current settings, or null during server render / before hydration. */
export function useDaydream(): DaydreamSettings | null {
  return useSyncExternalStore(subscribe, () => settings, () => null)
}

// Only one settings card is open at a time, shared by both placements.
let panelOpen = false
const panelListeners = new Set<() => void>()

export function setDaydreamPanelOpen(open: boolean | ((current: boolean) => boolean)): void {
  panelOpen = typeof open === "function" ? open(panelOpen) : open
  panelListeners.forEach((l) => l())
}

export function useDaydreamPanelOpen(): boolean {
  return useSyncExternalStore(
    (l) => { panelListeners.add(l); return () => { panelListeners.delete(l) } },
    () => panelOpen,
    () => false,
  )
}
