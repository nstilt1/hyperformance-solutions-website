"use client"

/* eslint-disable @next/next/no-img-element -- third-party thumbnails served by Openverse */

// Visitor-facing search over openly licensed art (Openverse API, called from
// the browser; no key, rate-limited per visitor). Results are drawn by this
// page, so the block's custom CSS styles each artwork directly.
//
// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

import { useCallback, useEffect, useRef, useState } from "react"
import { openverseLicenseLabel, openverseSearchUrl, parseIframeCss } from "@/lib/featured"

export default function OpenverseSearch({ side }) {
  const [query, setQuery] = useState(side.defaultQuery)
  const [active, setActive] = useState(side.defaultQuery)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [status, setStatus] = useState("idle") // idle | loading | error
  const [error, setError] = useState("")
  // Some sources' thumbnails fail to load; hide those results instead of showing alt text.
  const [broken, setBroken] = useState(() => new Set())
  const request = useRef(0)
  const { style, keyframesCss } = parseIframeCss(side.customCss)

  const search = useCallback(
    async (q, nextPage) => {
      const id = ++request.current
      if (!q.trim()) {
        setResults([]); setPageCount(0); setStatus("idle")
        return
      }
      setStatus("loading")
      setError("")
      try {
        const res = await fetch(
          openverseSearchUrl({ query: q, page: nextPage, pageSize: side.pageSize, includeShareAlike: side.includeShareAlike }),
        )
        if (res.status === 429) throw new Error("Too many searches right now. Try again in a minute.")
        if (!res.ok) throw new Error(`Search failed (${res.status})`)
        const body = await res.json()
        if (id !== request.current) return // a newer search superseded this one
        setResults((cur) => (nextPage === 1 ? body.results : [...cur, ...body.results]))
        setPage(nextPage)
        setPageCount(body.page_count || 0)
        setStatus("idle")
      } catch (e) {
        if (id !== request.current) return
        setError(e.message || "Search failed")
        setStatus("error")
      }
    },
    [side.pageSize, side.includeShareAlike],
  )

  // Default query (and CMS edits to it / to the licence options) re-run the search.
  useEffect(() => {
    setQuery(side.defaultQuery)
    setActive(side.defaultQuery)
  }, [side.defaultQuery])
  useEffect(() => {
    search(active, 1)
  }, [active, search])

  return (
    <div className="w-full">
      <form
        role="search"
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (query.trim() === active) search(active, 1)
          else setActive(query.trim())
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={side.placeholder}
          aria-label="Search openly licensed art"
          className="h-11 min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-zinc-900 px-5 font-medium text-white transition hover:bg-zinc-700"
        >
          Search
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div
        className="mt-5 grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))" }}
      >
        {results.filter((r) => !broken.has(r.id)).map((r) => (
          <figure key={r.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-black/5">
            <a href={r.foreign_landing_url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden bg-zinc-200">
              <img
                src={r.thumbnail}
                alt={r.title || "Artwork"}
                loading="lazy"
                className="h-full w-full object-cover"
                style={style}
                onError={() => setBroken((b) => new Set(b).add(r.id))}
              />
            </a>
            {/* CC BY requires a credit: title, creator, licence (with link), and source. */}
            <figcaption className="space-y-0.5 p-2 text-[11px] leading-snug text-zinc-600">
              <a href={r.foreign_landing_url} target="_blank" rel="noreferrer" className="line-clamp-1 font-medium text-zinc-800 hover:underline">
                {r.title || "Untitled"}
              </a>
              <div className="line-clamp-1">
                {r.creator ? (
                  <>by {r.creator_url ? <a href={r.creator_url} target="_blank" rel="noreferrer" className="hover:underline">{r.creator}</a> : r.creator} · </>
                ) : null}
                {r.license_url ? (
                  <a href={r.license_url} target="_blank" rel="noreferrer" className="hover:underline">{openverseLicenseLabel(r)}</a>
                ) : openverseLicenseLabel(r)}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {status === "loading" && results.length === 0 ? (
        <p className="mt-6 text-center text-sm text-zinc-500">Searching…</p>
      ) : null}
      {status === "idle" && active && results.length === 0 && !error ? (
        <p className="mt-6 text-center text-sm text-zinc-500">No openly licensed art found for “{active}”.</p>
      ) : null}

      {page < pageCount && results.length > 0 ? (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => search(active, page + 1)}
            disabled={status === "loading"}
            className="rounded-xl border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          >
            {status === "loading" ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}

      <p className="mt-4 text-[11px] text-zinc-500">
        Results from{" "}
        <a href="https://openverse.org" target="_blank" rel="noreferrer" className="underline">Openverse</a>
        , limited to licences that allow commercial use and adaptation. Effects shown here are applied by this site.
      </p>
      {/* Rebuilt from validated declarations only (see parseIframeCss). */}
      {keyframesCss ? <style>{keyframesCss}</style> : null}
    </div>
  )
}
