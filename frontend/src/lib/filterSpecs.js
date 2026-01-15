export const COMMON_FILTERS = [
  { key: "languages", label: "Languages" },
  { key: "frameworks", label: "Frameworks" },
  { key: "tags", label: "Tags" },
];

export const PROJECT_FILTERS = [
  ...COMMON_FILTERS,
  { key: "status", label: "Status" },
];