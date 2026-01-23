import { getCollection } from "@/lib/contentStore"
import CollectionGalleryPage from "@/components/content/CollectionGalleryPage"

export const dynamic = "force-static"

export default function ProjectsIndex() {
    return (
        <CollectionGalleryPage
            title="Projects"
            collection="projects"
            items={getCollection("projects")}
        />
    )
}
