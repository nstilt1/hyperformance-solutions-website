// Build-time loader for featured_data.json (synced from S3 into src/content/
// by the Amplify build). Read via fs so a missing file falls back to defaults
// instead of breaking the build.
import fs from "node:fs"
import path from "node:path"
import { DEFAULT_FEATURED, normalizeFeatured } from "@/lib/featured"

export function getFeatured() {
  try {
    const file = path.join(process.cwd(), "src", "content", "featured_data.json")
    if (!fs.existsSync(file)) return normalizeFeatured(DEFAULT_FEATURED)
    return normalizeFeatured(JSON.parse(fs.readFileSync(file, "utf8")))
  } catch (e) {
    console.warn("featured_data.json unreadable, using defaults:", e)
    return normalizeFeatured(DEFAULT_FEATURED)
  }
}
