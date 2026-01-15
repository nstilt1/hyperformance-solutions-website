import { CONTENT } from "@/lib/contentRegistry";
import GalleryPageClient from "@/components/GalleryPageClient";
import { COMMON_FILTERS } from "@/lib/filterSpecs";

export const dynamic = "error";
export const revalidate = false;

export default function ProjectsPage() {
  const items = CONTENT.projects.getAll();

  return (
    <GalleryPageClient
      title="Projects"
      basePath="/projects"
      items={items}
      filterSpec={COMMON_FILTERS}
      initialFilters={{
        languages: [],
        frameworks: [],
        tags: [],
        status: [],
      }}
    />
  );
}