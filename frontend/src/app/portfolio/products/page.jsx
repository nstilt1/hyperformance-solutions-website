import { getCollection } from "@/lib/contentStore"
import CollectionGalleryPage from "@/components/content/CollectionGalleryPage"

export const dynamic = "force-static"

export default function ProductsIndex() {
    return (
        <CollectionGalleryPage
            title="Products"
            collection="products"
            items={getCollection("products")}
        />
    )
}
