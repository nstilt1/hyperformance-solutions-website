"use client";

import { useMemo } from "react";
import { getFacetOptions } from "@/lib/filters";

export default function FiltersPanel({ items, filterSpec, filters, setFilters }) {
  // filterSpec example:
  // [{ key: "languages", label: "Languages" }, { key: "frameworks", label: "Frameworks" }]

  const optionsByKey = useMemo(() => {
    const out = {};
    for (const f of filterSpec) out[f.key] = getFacetOptions(items, f.key);
    return out;
  }, [items, filterSpec]);

  function toggle(key, value) {
    setFilters((prev) => {
      const cur = new Set(prev[key] || []);
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      return { ...prev, [key]: Array.from(cur) };
    });
  }

  return (
    <div className="rounded-xl border p-4 space-y-4">
      {filterSpec.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium">{label}</div>
          <div className="flex flex-wrap gap-2">
            {optionsByKey[key].map((opt) => {
              const active = (filters[key] || []).includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggle(key, opt)}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    active ? "bg-primary text-primary-foreground" : "bg-background"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}