import products from "@/content/products.json";
import projects from "@/content/projects.json";
import services from "@/content/services.json";

export function getAllProducts() {
  return products;
}

export function getAllServices() {
  return services;
}

export function getAllProjects() {
  return projects;
}

export function findBySlug(items, slug) {
  return items.find((x) => x.slug === slug) || null;
}
