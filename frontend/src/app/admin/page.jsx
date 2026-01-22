import {getAllProjects} from "@/lib/content";
import {getAllServices} from "@/lib/content";
import {getAllProducts} from "@/lib/content";
import ContentManager from "@/app/admin/ContentManager"

export default async function AdminContentPage() {
  // Pass file contents to a client component
  const services = await getAllServices();
  const projects = await getAllProjects();
  const products = await getAllProducts();
  const initial = {
    services,
    projects,
    products,
  }

  return (
    <div className="min-h-screen">
      <ContentManager initial={initial} />
    </div>
  )
}