import { getAllProducts, findBySlug } from "@/lib/content";
import ItemDetailPage from "@/components/ItemDetailPage";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const product = findBySlug(getAllProducts(), params.slug);
  return <ItemDetailPage item={product} />;
}