"use client"

// Navbar placement: the pill (brain toggles, rest opens settings).

import DaydreamPanel from "./DaydreamPanel"
import TogglePill from "./TogglePill"
import { useDaydream, useDaydreamPanelOpen } from "./store"
import { daydreamConfig } from "./engine"

export default function DaydreamNavbarToggle() {
  const settings = useDaydream()
  const open = useDaydreamPanelOpen()
  // Before hydration (settings null) follow the default placement, so the pill
  // doesn't flash in the navbar when it belongs in the floating button.
  if ((settings?.placement ?? daydreamConfig().defaults.placement) !== "navbar") return null

  return (
    <>
      <TogglePill variant="navbar" on={!!settings?.enabled} open={open} inheritsPageFilter />
      {settings && open ? <DaydreamPanel settings={settings} anchor="navbar" /> : null}
    </>
  )
}
