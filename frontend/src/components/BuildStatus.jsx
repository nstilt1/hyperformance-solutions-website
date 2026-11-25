"use client"

// Polls the `build_status` Rust Lambda (latest Amplify job per branch), modeled
// on abc-private's admin build watcher. Polls every 10s while any build is
// active, then stops on its own.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import { Button } from "@/components/ui/button"

const BUILD_STATUS_URL =
  process.env.NEXT_PUBLIC_BUILD_STATUS_URL ||
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/build_status`

const ACTIVE = new Set(["PENDING", "PROVISIONING", "RUNNING", "CANCELLING"])
const POLL_MS = 10_000

async function fetchStatuses() {
  const token = (await fetchAuthSession()).tokens?.accessToken?.toString()
  if (!token) throw new Error("Not signed in")
  const res = await fetch(BUILD_STATUS_URL, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Build status failed (${res.status})`)
  return body.statuses || []
}

/** Call `ref.current.watch()` right after triggering a rebuild webhook. */
const BuildStatus = forwardRef(function BuildStatus(_props, ref) {
  const [statuses, setStatuses] = useState([])
  const [error, setError] = useState("")
  const [watching, setWatching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastPoll, setLastPoll] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const s = await fetchStatuses()
      setStatuses(s)
      setError("")
      return s
    } catch (e) {
      setError(e.message || "Could not load build status")
      return null
    } finally {
      setLastPoll(new Date())
    }
  }, [])

  useImperativeHandle(ref, () => ({
    // Webhook-triggered jobs take a moment to appear; keep watching through that gap.
    watch: () => { setWatching(false); setTimeout(() => setWatching(true), 2_000) },
  }), [])

  // One check on load so the admin sees where things stand.
  useEffect(() => {
    setLoading(true)
    refresh().finally(() => setLoading(false))
  }, [refresh])

  useEffect(() => {
    if (!watching) return
    let cancelled = false
    let timer
    let idlePolls = 0
    const poll = async () => {
      const s = await refresh()
      if (cancelled) return
      const active = s?.some((b) => ACTIVE.has(b.status))
      // Allow a few idle polls right after a trigger before giving up.
      idlePolls = active ? 0 : idlePolls + 1
      if (!s || idlePolls >= 3) { setWatching(false); return }
      timer = setTimeout(poll, POLL_MS)
    }
    poll()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [watching, refresh])

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {statuses.map((b) => {
        const active = ACTIVE.has(b.status)
        const ok = b.status === "SUCCEED"
        const failed = b.status === "FAILED"
        const started = b.startTime ? new Date(b.startTime * 1000).toLocaleString() : null
        return (
          <span
            key={b.label}
            title={[b.branchName, b.jobId && `job ${b.jobId}`, started && `started ${started}`, b.commitId && `commit ${b.commitId}`, b.error].filter(Boolean).join(" · ")}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              active ? "border-blue-500/40 bg-blue-500/10 text-blue-700"
              : ok ? "border-green-500/40 bg-green-500/10 text-green-700"
              : failed ? "border-red-500/40 bg-red-500/10 text-red-700"
              : "bg-muted text-muted-foreground"}`}
          >
            <span className={active ? "animate-pulse" : ""}>●</span>
            {b.label}: {b.available ? b.status.toLowerCase().replaceAll("_", " ") : "unavailable"}
          </span>
        )
      })}
      {statuses.length === 0 && !error && <span className="text-muted-foreground">Build status not checked</span>}
      {error && <span className="text-red-600">Build status: {error}</span>}
      <Button type="button" size="sm" variant="outline" className="h-7" disabled={loading}
        onClick={() => setWatching((w) => !w)}>
        {watching ? "Stop watching" : loading ? "Checking…" : "Watch builds"}
      </Button>
      <span className="text-muted-foreground">
        Last poll: {lastPoll ? lastPoll.toLocaleTimeString() : "never"}
      </span>
    </div>
  )
})

export default BuildStatus
