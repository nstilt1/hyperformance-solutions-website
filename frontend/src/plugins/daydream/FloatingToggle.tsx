"use client"

// Floating placement (bottom-right): the pill (brain toggles, rest opens the
// settings card above it). Render outside the filtered page content (the
// host's overlay slot) so it's never recolored.

import DaydreamPanel from "./DaydreamPanel"
import TogglePill from "./TogglePill"
import { useDaydream, useDaydreamPanelOpen } from "./store"

export default function DaydreamFloatingToggle() {
  const settings = useDaydream()
  const open = useDaydreamPanelOpen()
  if (!settings || settings.placement !== "floating") return null

  return (
    <>
      <TogglePill variant="floating" on={settings.enabled} open={open} chevronUp />
      {open ? <DaydreamPanel settings={settings} anchor="floating" /> : null}
    </>
  )
}
