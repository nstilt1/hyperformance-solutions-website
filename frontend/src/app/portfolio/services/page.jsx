import { CONTENT } from "@/lib/contentRegistry";
import GalleryPageClient from "@/components/GalleryPageClient";
import { COMMON_FILTERS } from "@/lib/filterSpecs";

export const dynamic = "error";
export const revalidate = false;

export default function ServicesPage() {
  const items = CONTENT.services.getAll();

  return (
    <GalleryPageClient
      title="Services"
      basePath="/services"
      items={items}
      filterSpec={COMMON_FILTERS}
      initialFilters={{
        languages: [],
        frameworks: [],
        tags: [],
      }}
    />
  );
}