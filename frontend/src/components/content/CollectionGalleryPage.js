import FilterBar from "@/components/content/FilterBar"
import GalleryList from "@/components/content/GalleryList"

export default function CollectionGalleryPage({ title, collection, items }) {
    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-muted-foreground">
                Filter by language/framework. URL updates so filters are shareable.
            </p>

            {/* One set of controls */}
            <FilterBar itemsForOptions={items} />

            {/* The list uses the same URL query filters */}
            <GalleryList collection={collection} items={items} />
        </main>
    )
}
