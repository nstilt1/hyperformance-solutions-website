// Daydream Filter plugin. Portable between Next.js (App Router) sites:
// copy this folder + brain.png, then follow README.md.

import DaydreamFloatingToggle from "./FloatingToggle"
import DaydreamNavbarToggle from "./NavbarToggle"

export { configureDaydream, calcFreq, calcSat, calcSpeed } from "./engine"
export type { DaydreamConfig, DaydreamMode, DaydreamPlacement, DaydreamSettings } from "./engine"
export { setDaydream, useDaydream } from "./store"
export { DaydreamFloatingToggle, DaydreamNavbarToggle }

/** Plugin descriptor for hosts with slot registries ({ id, slots }). */
const daydreamPlugin = {
  id: "daydream",
  slots: {
    navbar: DaydreamNavbarToggle,
    overlay: DaydreamFloatingToggle,
  },
} as const

export default daydreamPlugin
