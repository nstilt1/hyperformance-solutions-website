"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { useGalleryFilters } from "@/components/content/useGalleryFilters"
import {mediaURL} from "@/lib/mediaURL";

function getCardImage(item) {
    // Prefer thumbnail, fall back to hero, else null
    const path = item.thumbPath || item.imagePath || "";
    return mediaURL(path);
}

export default function GalleryList({ collection, items, basePath = "" }) {
    const { q, language, framework, tag } = useGalleryFilters()
    const prefix = basePath ? `/${basePath.replace(/^\/+|\/+$/g, "")}` : ""

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
            const matchTag = tag ? (item.tags || []).includes(tag) : true
            return matchLang && matchFw && matchTag && matchQ
        })
    }, [items, q, language, framework])

    return (
        <div className="mt-4">
            <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                of <span className="font-medium text-foreground">{(items || []).length}</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => {
                    const img = getCardImage(item)

                    return (
                        <Link
                            key={`${collection}:${item.slug}`}
                            href={`${prefix}/${collection}/${item.slug}`}
                            className="group rounded-xl border overflow-hidden hover:bg-muted/30 transition"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-full bg-muted">
                                {/* 16:9 aspect box */}
                                <div className="aspect-[16/9] w-full">
                                    {img ? (
                                        <Image
                                            src={img}
                                            alt={item.title || item.slug}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    ) : (
                                        <div className="h-full w-full" />
                                    )}
                                </div>
                            </div>

                            {/* Text */}
                            <div className="p-4">
                                <div className="font-medium group-hover:underline underline-offset-4">
                                    {item.title || item.slug}
                                </div>

                                {item.shortDescription ? (
                                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                        {item.shortDescription}
                                    </div>
                                ) : null}

                                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                                    {(item.languages || []).length ? (
                                        <div className="line-clamp-1">
                                            Languages: {(item.languages || []).join(", ")}
                                        </div>
                                    ) : null}
                                    {(item.frameworks || []).length ? (
                                        <div className="line-clamp-1">
                                            Frameworks: {(item.frameworks || []).join(", ")}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
