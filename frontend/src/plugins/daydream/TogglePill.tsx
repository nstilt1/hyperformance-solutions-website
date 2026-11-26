"use client"

// The toggle, shared by both placements: one pill whose brain is its own
// button. Clicking the brain toggles the filter; clicking anywhere else on the
// pill opens the settings card. (Buttons can't nest, so the brain button is
// layered over the pill button rather than inside it.)

import BrainIcon from "./BrainIcon"
import { ChevronIcon } from "./icons"
import { setDaydream, setDaydreamPanelOpen } from "./store"

export default function TogglePill({ on, open, variant, inheritsPageFilter = false, chevronUp }: {
  on: boolean
  open: boolean
  variant: "navbar" | "floating"
  /** Brain sits inside the filtered page content (navbar). */
  inheritsPageFilter?: boolean
  /** Point the chevron up (card opens upward, as for the floating button). */
  chevronUp?: boolean
}) {
  return (
    <div className="dd-pill" data-variant={variant} data-on={on || undefined} data-dd-trigger="">
      <button
        type="button"
        className="dd-pill-main"
        aria-expanded={open}
        aria-label="Daydream Filter settings"
        onClick={() => setDaydreamPanelOpen((o) => !o)}
      >
        {variant === "floating" ? <span className="dd-pill-name">Daydream</span> : null}
        <span className="dd-state" data-on={on || undefined}>{on ? "ON" : "OFF"}</span>
        <ChevronIcon up={chevronUp ? !open : open} />
      </button>
      <button
        type="button"
        className="dd-pill-brain"
        aria-pressed={on}
        aria-label={`Daydream Filter: ${on ? "on" : "off"}. Click to turn ${on ? "off" : "on"}.`}
        title="Click the brain to toggle"
        onClick={() => setDaydream({ enabled: !on })}
      >
        <BrainIcon inheritsPageFilter={inheritsPageFilter} size={variant === "floating" ? 30 : 26} />
      </button>
    </div>
  )
}
