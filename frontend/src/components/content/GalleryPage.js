import GalleryClient from "@/components/content/GalleryClient"

export default function GalleryPage({ title, collection, items }) {
    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-muted-foreground">
                Filter by language/framework without any runtime fetch — page is still static.
            </p>

            <GalleryClient collection={collection} items={items} />
        </main>
    )
}