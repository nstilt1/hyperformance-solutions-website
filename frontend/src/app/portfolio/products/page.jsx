import { CONTENT } from "@/lib/contentRegistry";
import GalleryPageClient from "@/components/GalleryPageClient";
import { COMMON_FILTERS } from "@/lib/filterSpecs";

export const dynamic = "error";
export const revalidate = false;

export default function ProductsPage() {
  const items = CONTENT.products.getAll();

  return (
    <GalleryPageClient
      title="Products"
      basePath="/products"
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