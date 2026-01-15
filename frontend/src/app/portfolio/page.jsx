import { CONTENT } from "@/lib/contentRegistry";
import PortfolioClient from "./portfolioClient";

export const dynamic = "error";
export const revalidate = false;

export default function PortfolioPage() {
  // Build-time load all items
  const products = CONTENT.products.getAll().map((x) => ({ ...x, _type: "products" }));
  const services = CONTENT.services.getAll().map((x) => ({ ...x, _type: "services" }));
  const projects = CONTENT.projects.getAll().map((x) => ({ ...x, _type: "projects" }));

  const all = [...products, ...services, ...projects];

  return <PortfolioClient allItems={all} />;
}