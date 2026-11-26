// Site plugins. Each plugin is a folder under src/plugins/<id>/ whose index.js
// default-exports { id, slots }, where `slots` maps a slot name to a React
// component. Host components render <PluginSlot name="…" /> where plugins may
// appear. To add a plugin: create its folder and add it to this list.
//
// Slots:
//   navbar   right side of the navbar, left of the mobile menu button
//   overlay  rendered after the photosensitivity warning is acknowledged,
//            outside the page-content wrapper (for floating UI)

import daydream from "@/plugins/daydream"

export const plugins = [daydream]
