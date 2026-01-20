"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

import TiptapEditor from "@/components/tiptap/TiptapEditor"
import TiptapPreview from "@/components/tiptap/TiptapPreview"

import { postToApi } from "@/lib/post"

// ---- Helpers ----
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function normalizeSlug(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseCsvishList(s) {
  // Accept comma-separated; trim; drop empty
  return (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

function getEmptyDoc() {
  return { type: "doc", content: [{ type: "paragraph" }] }
}

function findEntryIndexBySlug(arr, slug) {
  return arr.findIndex((e) => e.slug === slug)
}

export default function ContentManager({ initial }) {
  const initialRef = useRef(deepClone(initial))

  const [data, setData] = useState(() => deepClone(initial))
  const [dirtyFiles, setDirtyFiles] = useState(() => new Set())

  const [collection, setCollection] = useState("services") // "services" | "projects" | "products"
  const [selectedSlug, setSelectedSlug] = useState(
    initial.services?.[0]?.slug || null
  )
  const [slugDraft, setSlugDraft] = useState("")
  const [languagesDraft, setLanguagesDraft] = useState("")
  const [frameworksDraft, setFrameworksDraft] = useState("")
  const [imagePathDraft, setImagePathDraft] = useState("")

  const [gitreposDraft, setGitreposDraft] = useState("")
  const [websiteAddressDraft, setWebsiteAddressDraft] = useState("")

  const entries = data[collection] || []

  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.slug === selectedSlug) || null
  }, [entries, selectedSlug])

  // Ensure selectedSlug exists when switching collections
  useEffect(() => {
    const first = (data[collection] || [])[0]?.slug || null
    setSelectedSlug((prev) => {
      if (!prev) return first
      const exists = (data[collection] || []).some((e) => e.slug === prev)
      return exists ? prev : first
    })
  }, [collection, data])

  useEffect(() => {
    if (!selectedEntry) {
      setSlugDraft("")
      setLanguagesDraft("")
      setFrameworksDraft("")
      setImagePathDraft("")
      setGitreposDraft("")
      setWebsiteAddressDraft("")
      return
    }

    setSlugDraft(selectedEntry.slug || "")
    setLanguagesDraft((selectedEntry.languages || []).join(", "))
    setFrameworksDraft((selectedEntry.frameworks || []).join(", "))
    setImagePathDraft(selectedEntry.imagePath || "")
    setGitreposDraft((selectedEntry.gitRepos || []).join(", "))
    setWebsiteAddressDraft(selectedEntry.url || "")
  }, [selectedEntry?.slug])

  function markDirty(fileKey) {
    setDirtyFiles((prev) => {
      const next = new Set(prev)
      next.add(fileKey)
      return next
    })
  }

  function updateSelectedEntry(patch) {
    if (!selectedEntry) return
    setData((prev) => {
      const next = deepClone(prev)
      const arr = next[collection] || []
      const idx = findEntryIndexBySlug(arr, selectedEntry.slug)
      if (idx < 0) return prev
      arr[idx] = { ...arr[idx], ...patch }
      next[collection] = arr
      return next
    })
    markDirty(collection)
  }

  function updateSelectedEntrySlug(newSlugRaw) {
    if (!selectedEntry) return
    const newSlug = normalizeSlug(newSlugRaw)
    if (!newSlug) return

    setData((prev) => {
      const next = deepClone(prev)
      const arr = next[collection] || []
      const idx = findEntryIndexBySlug(arr, selectedEntry.slug)
      if (idx < 0) return prev

      // Prevent collisions
      const collision = arr.some((e, i) => i !== idx && e.slug === newSlug)
      if (collision) return prev

      arr[idx] = { ...arr[idx], slug: newSlug }
      next[collection] = arr
      return next
    })

    setSelectedSlug(newSlug)
    markDirty(collection)
  }

  function createNewEntry(targetCollection) {
    const baseSlug = `new-${targetCollection}-${Date.now()}`
    const slug = normalizeSlug(baseSlug)

    const entry = {
      slug,
      shortDescription: "",
      imagePath: "",
      languages: [],
      frameworks: [],
      gitRepos: [],
      url: "",
      startDate: new Date().toISOString().slice(0, 10),
      tiptap: getEmptyDoc(),
    }

    setData((prev) => {
      const next = deepClone(prev)
      next[targetCollection] = [entry, ...(next[targetCollection] || [])]
      return next
    })

    setCollection(targetCollection)
    setSelectedSlug(slug)
    markDirty(targetCollection)
  }

  function deleteEntry(slugToDelete) {
    setData((prev) => {
      const next = deepClone(prev)
      const arr = next[collection] || []
      const idx = findEntryIndexBySlug(arr, slugToDelete)
      if (idx < 0) return prev
      arr.splice(idx, 1)
      next[collection] = arr
      return next
    })
    markDirty(collection)

    setSelectedSlug((prev) => {
      if (prev !== slugToDelete) return prev
      const remaining = (data[collection] || []).filter((e) => e.slug !== slugToDelete)
      return remaining[0]?.slug || null
    })
  }

  async function confirmChanges() {
    const dirty = Array.from(dirtyFiles)
    if (dirty.length === 0) return

    const payload = {}
    for (const key of dirty) {
      payload[key] = data[key]
    }

    const res = await postToApi("https://yy35luzj4k.execute-api.us-east-1.amazonaws.com/default/update_content", payload);

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Failed to save (${res.status}): ${text}`)
    }

    // If successful, reset dirty tracking
    setDirtyFiles(new Set())

    // Optional: update initial snapshot (so "dirty" is truly cleared)
    initialRef.current = deepClone(data)

    return res;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Content Manager</h1>

          <div className="flex items-center gap-2">
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">services.json</SelectItem>
                <SelectItem value="projects">projects.json</SelectItem>
                <SelectItem value="products">products.json</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value=""
              onValueChange={(v) => createNewEntry(v)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="New entry in..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">services.json</SelectItem>
                <SelectItem value="projects">projects.json</SelectItem>
                <SelectItem value="products">products.json</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => postToApi(process.env.FRONTEND_BUILD_URL) }>Build Frontend</Button>
            <Button onClick={() => postToApi(process.env.DASHBOARD_BUILD_URL) }>Build Dashboard</Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              // Reset to initial snapshot
              setData(deepClone(initialRef.current))
              setDirtyFiles(new Set())
            }}
          >
            Discard changes
          </Button>

          <Button
            onClick={() => {
              confirmChanges().catch((e) => {
                console.error(e)
                alert(e.message || "Failed to save")
              })
            }}
            disabled={dirtyFiles.size === 0}
          >
            Confirm changes{dirtyFiles.size ? ` (${dirtyFiles.size})` : ""}
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-12 gap-6 min-h-[75vh]">
        {/* Left: entries list */}
        <div className="col-span-3 border rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-muted/30">
            <div className="text-sm font-medium">
              {collection}.json entries ({entries.length})
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Click a slug to preview/edit
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {entries.map((e) => {
              const active = e.slug === selectedSlug
              return (
                <button
                  key={e.slug}
                  onClick={() => setSelectedSlug(e.slug)}
                  className={[
                    "w-full text-left px-3 py-2 border-b",
                    active ? "bg-muted" : "hover:bg-muted/40",
                  ].join(" ")}
                >
                  <div className="text-sm font-medium">{e.slug}</div>
                  {e.shortDescription ? (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {e.shortDescription}
                    </div>
                  ) : null}
                </button>
              )
            })}
            {entries.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No entries yet. Use “New entry in...” to create one.
              </div>
            ) : null}
          </div>
        </div>

        {/* Middle: metadata + editor */}
        <div className="col-span-5 border rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-muted/30">
            <div className="text-sm font-medium">Edit</div>
            <div className="text-xs text-muted-foreground">
              Metadata + Tiptap JSON content
            </div>
          </div>

          {!selectedEntry ? (
            <div className="p-4 text-sm text-muted-foreground">
              Select an entry (or create a new one).
            </div>
          ) : (
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Slug</label>
                  <Input
                    value={slugDraft}
                    onChange={(e) => setSlugDraft(e.target.value)}
                    onBlur={() => {
                      const normalized = normalizeSlug(slugDraft)
                      if (!normalized) {
                        // If they erased it, revert to current slug instead of saving empty
                        setSlugDraft(selectedEntry.slug || "")
                        return
                      }
                      // Only update if changed
                      if (normalized !== selectedEntry.slug) {
                        updateSelectedEntrySlug(normalized)
                        setSlugDraft(normalized)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur()
                      }
                    }}
                  />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Slug auto-normalizes (lowercase, hyphens). Must be unique within the file.
                  </div>
                </div>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete “{selectedEntry.slug}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This cannot be undone. The entry will be removed from {collection}.json.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteEntry(selectedEntry.slug)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Short description */}
              <div>
                <label className="text-xs text-muted-foreground">Short description</label>
                <Textarea
                  value={selectedEntry.shortDescription || ""}
                  onChange={(e) => updateSelectedEntry({ shortDescription: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Image path */}
              <div>
                <label className="text-xs text-muted-foreground">Image path (relative)</label>
                <Input
                  placeholder="/media/services/my-image.png"
                  value={imagePathDraft}
                  onChange={(e) => setImagePathDraft(e.target.value)}
                  onBlur={() => {
                    updateSelectedEntry({ imagePath: imagePathDraft.trim() })
                    setImagePathDraft(imagePathDraft.trim())
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur()
                  }}
                />
                <div className="text-[11px] text-muted-foreground mt-1">
                  Store a relative path (example: /media/...). Your frontend can prefix CDN/base URL.
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="text-xs text-muted-foreground">Website URL</label>
                <Input
                  placeholder="/media/services/my-image.png"
                  value={websiteAddressDraft}
                  onChange={(e) => setWebsiteAddressDraft(e.target.value)}
                  onBlur={() => {
                    updateSelectedEntry({ url: websiteAddressDraft.trim() })
                    setWebsiteAddressDraft(websiteAddressDraft.trim())
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur()
                  }}
                />
                <div className="text-[11px] text-muted-foreground mt-1">
                  Website URL for this product/service/project.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Language(s) */}
                <div>
                  <label className="text-xs text-muted-foreground">Languages (comma-separated)</label>
                  <Input
                    value={languagesDraft}
                    onChange={(e) => setLanguagesDraft(e.target.value)}
                    onBlur={() => {
                      updateSelectedEntry({ languages: parseCsvishList(languagesDraft) })
                      // Optionally reformat nicely after parsing:
                      setLanguagesDraft(parseCsvishList(languagesDraft).join(", "))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur()
                    }}
                  />
                </div>
                {/* Framework(s) */}
                <div>
                  <label className="text-xs text-muted-foreground">Frameworks (comma-separated)</label>
                  <Input
                    value={frameworksDraft}
                    onChange={(e) => setFrameworksDraft(e.target.value)}
                    onBlur={() => {
                      updateSelectedEntry({ frameworks: parseCsvishList(frameworksDraft) })
                      setFrameworksDraft(parseCsvishList(frameworksDraft).join(", "))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur()
                    }}
                  />
                </div>
                {/* Git Repo(s) */}
                <div>
                  <label className="text-xs text-muted-foreground">Git Repos</label>
                  <Input
                    value={gitreposDraft}
                    onChange={(e) => setGitreposDraft(e.target.value)}
                    onBlur={() => {
                      updateSelectedEntry({ gitRepos: parseCsvishList(gitreposDraft) })
                      setGitreposDraft(parseCsvishList(gitreposDraft).join(", "))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur()
                    }}
                  />
                </div>
              </div>

              {/* Start date */}
              <div>
                <label className="text-xs text-muted-foreground">Start date</label>
                <Input
                  type="date"
                  value={selectedEntry.startDate || ""}
                  onChange={(e) => updateSelectedEntry({ startDate: e.target.value })}
                />
              </div>

              <Separator />
              {/* Content */}
              <div>
                <div className="text-sm font-medium mb-2">Content</div>
                <div className="border rounded-lg p-2">
                  <TiptapEditor
                    value={selectedEntry.tiptap || getEmptyDoc()}
                    onChange={(doc) => updateSelectedEntry({ tiptap: doc })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-2">
                  Content is stored as Tiptap/ProseMirror JSON in the entry.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className="col-span-4 border rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-muted/30">
            <div className="text-sm font-medium">Preview</div>
            <div className="text-xs text-muted-foreground">
              Live, read-only render of the selected entry
            </div>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {!selectedEntry ? (
              <div className="text-sm text-muted-foreground">
                Select an entry to preview.
              </div>
            ) : (
              <div className="prose max-w-none">
                <TiptapPreview value={selectedEntry.tiptap || getEmptyDoc()} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}