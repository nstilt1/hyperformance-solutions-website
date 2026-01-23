import { getItem, getCollection } from "@/lib/contentStore"
import { buildItemMetadata } from "@/lib/seo"
import ItemPage from "@/components/content/ItemPage"

export const dynamic = "force-static"

export function generateStaticParams() {
  return getCollection("services").map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const item = getItem("services", params.slug)
  return buildItemMetadata({ collection: "services", item })
}

export default function ServicePage({ params }) {
  const item = getItem("services", params.slug)
  return <ItemPage item={item} />
}
