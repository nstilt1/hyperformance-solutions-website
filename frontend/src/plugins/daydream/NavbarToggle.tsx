"use client"

// Navbar placement: the pill (brain toggles, rest opens settings).

import DaydreamPanel from "./DaydreamPanel"
import TogglePill from "./TogglePill"
import { useDaydream, useDaydreamPanelOpen } from "./store"

export default function DaydreamNavbarToggle() {
  const settings = useDaydream()
  const open = useDaydreamPanelOpen()
  if (settings && settings.placement !== "navbar") return null

  return (
    <>
      <TogglePill variant="navbar" on={!!settings?.enabled} open={open} inheritsPageFilter />
      {settings && open ? <DaydreamPanel settings={settings} anchor="navbar" /> : null}
    </>
  )
}
