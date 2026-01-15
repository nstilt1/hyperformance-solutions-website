import { getAllProjects, findBySlug } from "@/src/lib/content";
import ItemDetailPage from "@/src/components/ItemDetailPage";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }) {
  const project = findBySlug(getAllProjects(), params.slug);
  return <ItemDetailPage item={project} />;
}