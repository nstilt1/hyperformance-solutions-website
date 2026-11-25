// Media helpers for the dashboard: CDN URLs, S3 listing (list_media Lambda)
// and uploads (hf_presign Lambda + presigned PUT).
//
// Stored image paths are relative to the CDN's /media/ folder
// (e.g. "uploads/logo.png" -> <cdn>/media/uploads/logo.png), matching how the
// public site resolves them.

import { fetchAuthSession } from "aws-amplify/auth"
import { isHiddenSourceImage } from "@/lib/featured"

const CDN = (process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.hyperformancesolutions.com").replace(/\/+$/, "")
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "")
const LIST_URL = process.env.NEXT_PUBLIC_LIST_MEDIA_URL || (API && `${API}/list_media`)
const PRESIGN_URL = process.env.NEXT_PUBLIC_PRESIGN_URL || (API && `${API}/hf_presign`)

/** Upload destinations. hf_presign may only write under media/. */
export const UPLOAD_FOLDERS = ["uploads", "images", "thumbs"]

export function mediaPathToUrl(path) {
  if (!path || typeof path !== "string" || !path.trim()) return null
  const p = path.trim()
  if (/^https?:\/\//.test(p)) return p
  if (isHiddenSourceImage(p)) return null
  return `${CDN}/media/${p.replace(/^\/+/, "").replace(/^media\//, "")}`
}

async function accessToken() {
  const token = (await fetchAuthSession()).tokens?.accessToken?.toString()
  if (!token) throw new Error("You are not signed in")
  return token
}

/** One page of images: { files: [{ key, path, url, size, lastModified }], cursor }. */
export async function listMedia({ cursor, prefix } = {}) {
  if (!LIST_URL) throw new Error("NEXT_PUBLIC_LIST_MEDIA_URL is not configured")
  const params = new URLSearchParams()
  if (cursor) params.set("cursor", cursor)
  if (prefix) params.set("prefix", prefix)
  const res = await fetch(`${LIST_URL}?${params}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
    cache: "no-store",
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Media list failed (${res.status})`)
  return { files: body.files || [], cursor: body.cursor || null }
}

/** Uploads a file under media/<folder>/ and returns its stored path ("<folder>/<name>"). */
export async function uploadMedia(file, folder = "uploads") {
  if (!PRESIGN_URL) throw new Error("NEXT_PUBLIC_PRESIGN_URL is not configured")
  const filename = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_")
  const ext = filename.includes(".") ? filename.split(".").pop().toLowerCase() : ""
  const contentType = file.type || "application/octet-stream"
  const res = await fetch(PRESIGN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await accessToken()}` },
    body: JSON.stringify({ folder: `media/${folder.replace(/^\/+|\/+$/g, "")}`, filename, contentType, ext }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Upload could not start (${res.status}) ${text}`)
  const { uploadUrl, key } = JSON.parse(text)
  if (!uploadUrl || !key) throw new Error("Upload response was missing its URL or key")
  const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: file })
  if (!put.ok) throw new Error(`S3 upload failed (${put.status})`)
  return key.replace(/^media\//, "")
}
