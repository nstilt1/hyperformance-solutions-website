"use client";

import { useMemo, useState } from "react";
import { filterItems } from "@/src/lib/filters";
import FiltersPanel from "@/src/components/FiltersPanel";
import ItemGallery from "@/src/components/ItemGallery";
import { CONTENT } from "@/src/lib/contentRegistry";

export default function PortfolioClient({ allItems }) {
  const [filters, setFilters] = useState({
    languages: [],
    frameworks: [],
  });

  const filtered = useMemo(() => filterItems(allItems, filters), [allItems, filters]);

  const byType = useMemo(() => {
    const m = { products: [], services: [], projects: [] };
    for (const it of filtered) m[it._type].push(it);
    return m;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Portfolio</h1>

      <FiltersPanel
        items={allItems}
        filterSpec={[
          { key: "languages", label: "Languages" },
          { key: "frameworks", label: "Frameworks" },
        ]}
        filters={filters}
        setFilters={setFilters}
      />

      <ItemGallery
        title={CONTENT.products.label}
        basePath={CONTENT.products.basePath}
        items={byType.products}
      />

      <ItemGallery
        title={CONTENT.services.label}
        basePath={CONTENT.services.basePath}
        items={byType.services}
      />

      <ItemGallery
        title={CONTENT.projects.label}
        basePath={CONTENT.projects.basePath}
        items={byType.projects}
      />
    </div>
  );
}