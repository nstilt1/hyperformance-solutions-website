// The Featured editor mirrors its unsaved state here so /admin/preview (opened
// in another tab) can render exactly what the homepage would show.
export const FEATURED_DRAFT_KEY = "hf:featured-draft:v1"

export function writeFeaturedDraft(featured) {
  try { localStorage.setItem(FEATURED_DRAFT_KEY, JSON.stringify(featured)) } catch { /* storage full/disabled */ }
}

export function readFeaturedDraft() {
  try {
    const raw = localStorage.getItem(FEATURED_DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
