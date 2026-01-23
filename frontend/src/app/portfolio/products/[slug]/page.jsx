import { getItem, getCollection } from "@/lib/contentStore"
import { buildItemMetadata } from "@/lib/seo"
import ItemPage from "@/components/content/ItemPage"

export const dynamic = "force-static"

export function generateStaticParams() {
  return getCollection("products").map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const item = getItem("products", params.slug)
  return buildItemMetadata({ collection: "products", item })
}

export default function ProductPage({ params }) {
  const item = getItem("products", params.slug)
  return <ItemPage item={item} />
}
