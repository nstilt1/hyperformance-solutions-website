import fs from "fs";
import path from "path";

function readJson(relPath) {
  const p = path.join(process.cwd(), relPath);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export function getAllProducts() {
  return readJson("src/content/products.json");
}

export function getAllServices() {
  return readJson("src/content/services.json");
}

export function getAllProjects() {
  return readJson("src/content/projects.json");
}

export function findBySlug(items, slug) {
  return items.find((x) => x.slug === slug) || null;
}
