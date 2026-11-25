"use client"

// Full-width preview of the homepage's featured content using the editor's
// current (unsaved) draft. Updates live when the editor tab changes the draft.

import { useEffect, useState } from "react"
import FeaturedHero from "@/components/featured/FeaturedHero"
import FeaturedProjects from "@/components/featured/FeaturedProjects"
import { DEFAULT_FEATURED, normalizeFeatured } from "@/lib/featured"
import { FEATURED_DRAFT_KEY, readFeaturedDraft } from "@/lib/featuredDraft"

export default function FeaturedPreviewPage() {
  const [featured, setFeatured] = useState(() => normalizeFeatured(DEFAULT_FEATURED))
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    const load = () => {
      const draft = readFeaturedDraft()
      setHasDraft(!!draft)
      setFeatured(normalizeFeatured(draft ?? DEFAULT_FEATURED))
    }
    load()
    const onStorage = (e) => { if (e.key === FEATURED_DRAFT_KEY) load() }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
        Homepage preview · {hasDraft ? "showing your current edits (updates live)" : "no draft yet, showing defaults"} · the rest of the homepage (about + portfolio) follows below these sections
      </div>
      <FeaturedHero hero={featured.hero} trackLoading={false} />
      <FeaturedProjects projects={featured.projects} />
    </div>
  )
}
