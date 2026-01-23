import services from "@/content/services.json"
import projects from "@/content/projects.json"
import products from "@/content/products.json"
import { getSiteUrl } from "@/lib/siteUrl"

export default function sitemap() {
    const siteUrl = getSiteUrl()
    const now = new Date().toISOString()

    const base = [
        { url: `${siteUrl}/`, lastModified: now },
        { url: `${siteUrl}/services`, lastModified: now },
        { url: `${siteUrl}/projects`, lastModified: now },
        { url: `${siteUrl}/products`, lastModified: now },
    ]

    const serviceUrls = (services || []).map((s) => ({
        url: `${siteUrl}/services/${s.slug}`,
        lastModified: now,
    }))

    const projectUrls = (projects || []).map((p) => ({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: now,
    }))

    const productUrls = (products || []).map((p) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: now,
    }))

    return [...base, ...serviceUrls, ...projectUrls, ...productUrls]
}