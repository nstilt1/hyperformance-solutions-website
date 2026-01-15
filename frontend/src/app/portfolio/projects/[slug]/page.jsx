import { getAllProjects, findBySlug } from "@/lib/content";
import ItemDetailPage from "@/components/ItemDetailPage";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const project = findBySlug(getAllProjects(), params.slug);
  return <ItemDetailPage item={project} />;
}