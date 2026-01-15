import services from "@/content/services.json"
import projects from "@/content/projects.json"
import products from "@/content/products.json"
import ContentManager from "@/app/admin/ContentManager"

export default function AdminContentPage() {
  // Pass file contents to a client component
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