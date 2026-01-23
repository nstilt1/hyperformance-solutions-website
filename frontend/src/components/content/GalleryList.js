"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useGalleryFilters } from "@/components/content/useGalleryFilters"

export default function GalleryList({ collection, items }) {
    const { q, language, framework } = useGalleryFilters()

    const filtered = useMemo(() => {
        const qLower = q.trim().toLowerCase()

        return (items || []).filter((item) => {
            const matchLang = language ? (item.languages || []).includes(language) : true
            const matchFw = framework ? (item.frameworks || []).includes(framework) : true
            const matchQ = qLower
                ? `${item.slug} ${item.title || ""} ${item.shortDescription || ""}`
                    .toLowerCase()
                    .includes(qLower)
                : true
            return matchLang && matchFw && matchQ
        })
    }, [items, q, language, framework])

    return (
        <div className="mt-4">
            <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                of <span className="font-medium text-foreground">{(items || []).length}</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {filtered.map((item) => (
                    <Link
                        key={`${collection}:${item.slug}`}
                        href={`/${collection}/${item.slug}`}
                        className="rounded-lg border p-4 hover:bg-muted/30"
                    >
                        <div className="font-medium">{item.title || item.slug}</div>
                        {item.shortDescription ? (
                            <div className="mt-1 text-sm text-muted-foreground">
                                {item.shortDescription}
                            </div>
                        ) : null}

                        <div className="mt-3 text-xs text-muted-foreground">
                            {(item.languages || []).length ? (
                                <div>Languages: {(item.languages || []).join(", ")}</div>
                            ) : null}
                            {(item.frameworks || []).length ? (
                                <div>Frameworks: {(item.frameworks || []).join(", ")}</div>
                            ) : null}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
