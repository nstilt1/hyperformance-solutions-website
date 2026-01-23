"use client"

import { useSearchParams } from "next/navigation"

export function useGalleryFilters() {
    const sp = useSearchParams()
    return {
        q: sp.get("q") || "",
        language: sp.get("language") || "",
        framework: sp.get("framework") || "",
        tag: sp.get("tag") || "",
    }
}
