import services from "@/content/services.json"
import projects from "@/content/projects.json"
import products from "@/content/products.json"

export const COLLECTIONS = ["services", "projects", "products"]

const store = {
    services,
    projects,
    products,
}

export function getCollection(collection) {
    if (!COLLECTIONS.includes(collection)) return []
    return store[collection] || []
}

export function getItem(collection, slug) {
    const items = getCollection(collection)
    return items.find((x) => x.slug === slug) || null
}

export function getAllItems() {
    return {
        services: getCollection("services"),
        projects: getCollection("projects"),
        products: getCollection("products"),
    }
}
