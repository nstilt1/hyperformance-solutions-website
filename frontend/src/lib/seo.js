import { getSiteUrl } from "@/lib/siteUrl"

export function buildItemMetadata({ collection, item }) {
    if (!item) return {}

    const siteUrl = getSiteUrl()
    const url = `${siteUrl}/${collection}/${item.slug}`

    const title = item.title || item.slug
    const description = item.shortDescription || ""

    // imagePath should be relative like "/media/xyz.png"
    const images = item.imagePath ? [`${siteUrl}${item.imagePath}`] : undefined

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            images,
        },
        twitter: {
            card: images?.length ? "summary_large_image" : "summary",
            title,
            description,
            images,
        },
    }
}
