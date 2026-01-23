import { getAllItems } from "@/lib/contentStore"
import FilterBar from "@/components/content/FilterBar"
import GalleryList from "@/components/content/GalleryList"

export const dynamic = "force-static"

export default function PortfolioPage() {
  const { products, projects, services } = getAllItems()
  const all = [...products, ...projects, ...services]

  return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Portfolio</h1>
        <p className="mt-2 text-muted-foreground">
          Browse everything in one place. Filters apply to all sections below.
        </p>

        {/* ONE control bar for the entire page */}
        <FilterBar itemsForOptions={all} />

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Products</h2>
          <GalleryList collection="products" items={products} />
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <GalleryList collection="projects" items={projects} />
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Services</h2>
          <GalleryList collection="services" items={services} />
        </section>
      </main>
  )
}
