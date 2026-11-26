"use client"

import { plugins } from "@/plugins/registry"

/** Renders every registered plugin's component for this slot (see registry.js). */
export default function PluginSlot({ name }) {
  return plugins.map((plugin) => {
    const Component = plugin.slots?.[name]
    return Component ? <Component key={plugin.id} /> : null
  })
}
