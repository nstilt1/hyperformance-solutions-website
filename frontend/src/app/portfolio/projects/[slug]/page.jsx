import { getItem, getCollection } from "@/lib/contentStore"
import { buildItemMetadata } from "@/lib/seo"
import ItemPage from "@/components/content/ItemPage"

export const dynamic = "force-static"

export function generateStaticParams() {
  return getCollection("projects").map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const item = getItem("projects", params.slug)
  return buildItemMetadata({ collection: "projects", item })
}

export default function ProjectPage({ params }) {
  const item = getItem("projects", params.slug)
  return <ItemPage item={item} />
}
