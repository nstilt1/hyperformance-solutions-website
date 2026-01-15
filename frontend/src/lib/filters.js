export function filterItems(items, filters) {
  // filters example: { languages: ["Rust"], frameworks: ["Next.js"] }
  return items.filter((item) => {
    for (const [field, selected] of Object.entries(filters)) {
      if (!selected?.length) continue;

      const value = item[field];

      // allow single string or array-of-strings
      const arr = Array.isArray(value) ? value : (value ? [value] : []);

      // require intersection
      const matches = selected.some((s) => arr.includes(s));
      if (!matches) return false;
    }
    return true;
  });
}

export function getFacetOptions(items, field) {
  const set = new Set();
  for (const item of items) {
    const v = item[field];
    if (Array.isArray(v)) v.forEach((x) => set.add(x));
    else if (typeof v === "string") set.add(v);
  }
  return Array.from(set).sort();
}