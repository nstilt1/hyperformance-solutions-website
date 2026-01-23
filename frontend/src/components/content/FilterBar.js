"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
    )
}

/**
 * FilterBar controls URL query params:
 *  - q
 *  - language
 *  - framework
 *
 * Provide `itemsForOptions` as the list of items used to compute dropdown options.
 * For portfolio page, pass the combined array (products+projects+services).
 */
export default function FilterBar({ itemsForOptions }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const q = searchParams.get("q") || ""
    const language = searchParams.get("language") || ""
    const framework = searchParams.get("framework") || ""
    const tag = searchParams.get("tag") || ""

    const { allLanguages, allFrameworks, allTags } = useMemo(() => {
        const langs = []
        const fws = []
        const tags = []
        for (const item of itemsForOptions || []) {
            for (const l of item.languages || []) langs.push(l)
            for (const f of item.frameworks || []) fws.push(f)
            for (const t of item.tags || []) tags.push(t)
        }
        return {
            allLanguages: uniqueSorted(langs),
            allFrameworks: uniqueSorted(fws),
            allTags: uniqueSorted(tags),
        }
    }, [itemsForOptions])

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
            <div className="grid gap-3 md:grid-cols-4">
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

                <div>
                    <div className="text-xs text-muted-foreground mb-1">Tag</div>
                    <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={tag}
                        onChange={(e) => setParam("tag", e.target.value)}
                    >
                        <option value="">All</option>
                        {allTags.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Filters apply to this page’s sections.
                </div>
                <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                </Button>
            </div>
        </div>
    )
}
