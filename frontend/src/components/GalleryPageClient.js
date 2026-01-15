"use client";

import { useMemo, useState } from "react";
import FiltersPanel from "@/src/components/FiltersPanel";
import ItemGallery from "@/src/components/ItemGallery";
import { filterItems } from "@/src/lib/filters";

export default function GalleryPageClient({
  title,
  basePath,
  items,
  filterSpec,
  initialFilters,
}) {
  const [filters, setFilters] = useState(initialFilters || {});

  const filteredItems = useMemo(() => {
    return filterItems(items, filters);
  }, [items, filters]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length}
        </div>
      </div>

      {!!filterSpec?.length && (
        <FiltersPanel
          items={items}
          filterSpec={filterSpec}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <ItemGallery title={null} basePath={basePath} items={filteredItems} />
    </div>
  );
}