"use client"

import Link from "next/link"
import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
    )
}

export default function GalleryClient({ collection, items }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const language = searchParams.get("language") || ""
    const framework = searchParams.get("framework") || ""
    const q = searchParams.get("q") || ""

    const { allLanguages, allFrameworks } = useMemo(() => {
        const langs = []
        const fws = []
        for (const item of items) {
            for (const l of item.languages || []) langs.push(l)
            for (const f of item.frameworks || []) fws.push(f)
        }
        return {
            allLanguages: uniqueSorted(langs),
            allFrameworks: uniqueSorted(fws),
        }
    }, [items])

    const filtered = useMemo(() => {
        const qLower = q.trim().toLowerCase()
        return items.filter((item) => {
            const matchLang = language
                ? (item.languages || []).includes(language)
                : true
            const matchFw = framework
                ? (item.frameworks || []).includes(framework)
                : true
            const matchQ = qLower
                ? `${item.slug} ${item.title || ""} ${item.shortDescription || ""}`
                    .toLowerCase()
                    .includes(qLower)
                : true
            return matchLang && matchFw && matchQ
        })
    }, [items, language, framework, q])

    function setParam(key, value) {
        const sp = new URLSearchParams(searchParams.toString())
        if (!value) sp.delete(key)
        else sp.set(key, value)
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
    }

    function clearFilters() {
        router.replace(pathname, { scroll: false })
    }

    return (
        <div className="mt-6">
            <div className="grid gap-3 md:grid-cols-3">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Search</div>
                    <Input
                        value={q}
                        onChange={(e) => setParam("q", e.target.value)}
                        placeholder="Search slug/title/description"
                    />
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">Language</div>
                    <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={language}
                        onChange={(e) => setParam("language", e.target.value)}
                    >
                        <option value="">All</option>
                        {allLanguages.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">Framework</div>
                    <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={framework}
                        onChange={(e) => setParam("framework", e.target.value)}
                    >
                        <option value="">All</option>
                        {allFrameworks.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                    of <span className="font-medium text-foreground">{items.length}</span>
                </div>
                <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {filtered.map((item) => (
                    <Link
                        key={item.slug}
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
