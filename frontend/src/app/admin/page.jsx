import {getAllProjects} from "@/lib/content";
import {getAllServices} from "@/lib/content";
import {getAllProducts} from "@/lib/content";
import { Suspense } from "react";
import ContentManager from "@/app/admin/ContentManager"
import { getFeatured } from "@/lib/content";
import { normalizeFeatured } from "@/lib/featured";

export default async function AdminContentPage() {
  // Pass file contents to a client component
  const services = await getAllServices();
  const projects = await getAllProjects();
  const products = await getAllProducts();
  const featured = normalizeFeatured(await getFeatured());
  const initial = {
    services,
    projects,
    products,
    featured,
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <ContentManager initial={initial} />
      </Suspense>
    </div>
  )
}