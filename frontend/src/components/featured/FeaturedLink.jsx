// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).
import Link from "next/link"

const STYLES = {
  primary:
    "bg-white text-black hover:bg-zinc-200",
  secondary:
    "border border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur",
  // For buttons on the light page body (featured projects).
  dark: "bg-zinc-900 text-white hover:bg-zinc-700",
}

/** Internal hrefs ("/…", "#…") use client routing; anything else opens a new tab. */
export default function FeaturedLink({ href, variant = "primary", children, className = "" }) {
  const cls = `inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition ${STYLES[variant] ?? STYLES.primary} ${className}`
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} className={cls}>{children}</Link>
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  )
}
