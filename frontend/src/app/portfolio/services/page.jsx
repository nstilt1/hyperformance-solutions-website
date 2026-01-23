import { getCollection } from "@/lib/contentStore"
import CollectionGalleryPage from "@/components/content/CollectionGalleryPage"

export const dynamic = "force-static"

export default function ServicesIndex() {
    return (
        <CollectionGalleryPage
            title="Services"
            collection="services"
            items={getCollection("services")}
        />
    )
}
