import { daydreamConfig } from "./engine"

/**
 * The extension's brain. Greyed out when off; shows the live filter when on
 * (daydream.css). `inheritsPageFilter` marks a brain inside the page content,
 * which full-page mode already filters (so it isn't filtered twice).
 */
export default function BrainIcon({ inheritsPageFilter = false, size = 28 }: { inheritsPageFilter?: boolean; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={daydreamConfig().brainSrc}
      alt=""
      width={size}
      height={size}
      className="dd-brain"
      data-inherits={inheritsPageFilter || undefined}
    />
  )
}
