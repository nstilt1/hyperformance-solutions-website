import fs from "node:fs/promises"
import path from "node:path"

// Content is read from src/content/, which the Amplify build fills with
// `aws s3 sync` straight from the bucket (same as the public site). It is NOT
// fetched from the CDN: CloudFront ignores query strings, so a cache-buster
// like ?t= doesn't work and a build right after a save could get stale JSON.
// The CDN URL (URL_*) is only a fallback for local dev without src/content/.
async function readContent(filename, fallbackUrl) {
  try {
    const file = path.join(process.cwd(), "src", "content", filename)
    return JSON.parse(await fs.readFile(file, "utf8"))
  } catch (error) {
    if (error.code !== "ENOENT") console.error(`Error reading src/content/${filename}:`, error)
  }
  return fetchData(fallbackUrl)
}

// Fallback only (local dev). May return a cached copy; see above.
async function fetchData(url) {
  if (!url) {
    console.error("Error: Missing environment variable for URL");
    return []; // Return empty array to prevent app crash
  }
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
}

export async function getAllProducts() {
  return await readContent("products.json", process.env.URL_PRODUCTS);
}

export async function getAllServices() {
  return await readContent("services.json", process.env.URL_SERVICES);
}

export async function getAllProjects() {
  return await readContent("projects.json", process.env.URL_PROJECTS);
}

// featured_data.json sits next to the other content files. URL_FEATURED can
// override; otherwise it's derived from URL_PRODUCTS. A missing file (first
// deploy) yields [] which normalizeFeatured turns into the defaults.
export async function getFeatured() {
  const url =
    process.env.URL_FEATURED ||
    (process.env.URL_PRODUCTS
      ? process.env.URL_PRODUCTS.replace(/products\.json$/, "featured_data.json")
      : "")
  return await readContent("featured_data.json", url);
}

export function findBySlug(items, slug) {
  if (!items || !Array.isArray(items)) return null;
  return items.find((x) => x.slug === slug) || null;
}