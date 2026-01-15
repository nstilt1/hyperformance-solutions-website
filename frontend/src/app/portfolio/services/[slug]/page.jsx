import { getAllServices, findBySlug } from "@/src/lib/content";
import ItemDetailPage from "@/src/components/ItemDetailPage";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return getAllServices().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const service = findBySlug(getAllServices(), params.slug);
  return <ItemDetailPage item={service} />;
}