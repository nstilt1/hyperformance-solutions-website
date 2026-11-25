"use client"

/* eslint-disable @next/next/no-img-element -- admin-managed CDN images, previewed as-is */

// Browse S3 media or upload a new image, then hand back the stored path.
// Adapted from abc-private's MediaPicker.

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UPLOAD_FOLDERS, listMedia, mediaPathToUrl, uploadMedia } from "@/lib/media"

const CHECKERBOARD = "bg-[repeating-conic-gradient(#d4d4d4_0_25%,#f4f4f4_0_50%)] bg-[length:16px_16px]"

/**
 * Controlled dialog. `onSelect(path, file)` receives the stored path
 * (relative to /media/) and the listing entry (with its full `url`).
 */
export function MediaPickerDialog({ open, onOpenChange, value, onSelect, uploadFolder = "uploads" }) {
  const [files, setFiles] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [folder, setFolder] = useState(uploadFolder)
  const [uploading, setUploading] = useState("")
  const fileRef = useRef(null)

  async function load(nextCursor) {
    setLoading(true)
    setError("")
    try {
      const page = await listMedia({ cursor: nextCursor })
      setFiles((cur) => (nextCursor ? [...cur, ...page.files] : page.files))
      setCursor(page.cursor)
      setLoaded(true)
    } catch (e) {
      setError(e.message || "Could not load media")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && !loaded) void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loaded])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle ? files.filter((f) => f.path.toLowerCase().includes(needle)) : files
  }, [files, query])

  function choose(file) {
    onSelect(file.path, file)
    onOpenChange(false)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setError("")
    setUploading(`Uploading ${file.name}…`)
    try {
      const path = await uploadMedia(file, folder)
      setUploading("")
      choose({ path, url: mediaPathToUrl(path) })
      setLoaded(false) // refresh the list next time it opens
    } catch (err) {
      setUploading("")
      setError(err.message || "Upload failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Select or upload an image</DialogTitle>
          <DialogDescription>Choose an image from S3, or upload a new one. Uploads are selected automatically.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by folder or filename…" autoFocus />
          <Button type="button" variant="outline" onClick={() => load()} disabled={loading}>{loading ? "Loading…" : "Refresh"}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-sm">
          <span className="text-muted-foreground">Upload to</span>
          <select aria-label="Upload folder" className="h-8 rounded-md border bg-background px-2 text-sm" value={folder} onChange={(e) => setFolder(e.target.value)}>
            {UPLOAD_FOLDERS.map((f) => <option key={f} value={f}>media/{f}/</option>)}
          </select>
          <input ref={fileRef} type="file" accept="image/*,.svg" className="hidden" onChange={handleUpload} />
          <Button type="button" size="sm" onClick={() => fileRef.current?.click()} disabled={Boolean(uploading)}>
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          {uploading ? <span className="text-xs text-muted-foreground">{uploading}</span> : null}
        </div>
        {error ? <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
        <div className="grid max-h-[55vh] grid-cols-2 content-start gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
          {shown.map((f) => (
            <button key={f.key} type="button" onClick={() => choose(f)}
              className={`flex flex-col rounded-md border text-left hover:border-primary ${value === f.path ? "ring-2 ring-primary" : ""}`}>
              <div className={`relative aspect-square w-full overflow-hidden rounded-t-md ${CHECKERBOARD}`}>
                <img src={f.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
              </div>
              <div className="space-y-1 p-2">
                <p className="break-all text-xs font-medium">{f.path}</p>
                <p className="text-[11px] text-muted-foreground">{Math.max(1, Math.round(f.size / 1024))} KB</p>
              </div>
            </button>
          ))}
          {loaded && !loading && shown.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No matching images.</p>
          ) : null}
        </div>
        {cursor ? <Button type="button" variant="outline" onClick={() => load(cursor)} disabled={loading}>{loading ? "Loading…" : "Load more"}</Button> : null}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Text input for an image path with "Browse / upload" and a thumbnail.
 * `onChange(path)` fires on picker selection and when the typed value is committed (blur/Enter).
 */
export function ImagePathField({ value, onChange, placeholder = "uploads/my-image.png", uploadFolder = "uploads" }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value || "")
  const [lastValue, setLastValue] = useState(value || "")
  if ((value || "") !== lastValue) {
    // Parent changed it (e.g. switched entries); follow it.
    setLastValue(value || "")
    setDraft(value || "")
  }
  const preview = mediaPathToUrl(value)

  function commit(next) {
    const trimmed = next.trim()
    setDraft(trimmed)
    if (trimmed !== (value || "")) onChange(trimmed)
  }

  return (
    <div className="flex items-center gap-2">
      <Input className="flex-1" placeholder={placeholder} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }} />
      <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setOpen(true)}>
        Browse / upload
      </Button>
      {preview ? (
        <button type="button" title="Change image" onClick={() => setOpen(true)}
          className={`h-9 w-12 shrink-0 overflow-hidden rounded border ${CHECKERBOARD}`}>
          <img src={preview} alt="Selected image" className="h-full w-full object-contain" />
        </button>
      ) : null}
      <MediaPickerDialog open={open} onOpenChange={setOpen} value={value} uploadFolder={uploadFolder}
        onSelect={(path) => commit(path)} />
    </div>
  )
}
