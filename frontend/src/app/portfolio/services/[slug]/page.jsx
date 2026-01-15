import { getAllServices, findBySlug } from "@/lib/content";
import ItemDetailPage from "@/components/ItemDetailPage";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return getAllServices().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const service = findBySlug(getAllServices(), params.slug);
  return <ItemDetailPage item={service} />;
}