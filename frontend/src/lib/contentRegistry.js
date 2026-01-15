import { getAllProducts, getAllServices, getAllProjects } from "@/src/lib/content";

export const CONTENT = {
  products: {
    label: "Products",
    basePath: "/products",
    getAll: getAllProducts,
  },
  services: {
    label: "Services",
    basePath: "/services",
    getAll: getAllServices,
  },
  projects: {
    label: "Projects",
    basePath: "/projects",
    getAll: getAllProjects,
  },
};