// maybe implement the dashboard in `src/app/page.js`

import React, { Suspense } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import ImageCard from "@/components/ImageCard";
import { motion } from 'framer-motion';
import Hero from "@/components/Hero";
import BriefAbout from "@/components/BriefAbout";
import { Separator } from "@radix-ui/react-separator";
import { getAllItems } from "@/lib/contentStore"
import FilterBar from "@/components/content/FilterBar"
import GalleryList from "@/components/content/GalleryList"

export const dynamic = "force-static"
const Dashboard = () => {
  const { products, projects, services } = getAllItems()
  const all = [...products, ...projects, ...services]

  return (
    <>
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
      <Hero />
      <BriefAbout />
      <Separator />
    </div>
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Portfolio</h1>
      <p className="mt-2 text-muted-foreground">
        Browse everything in one place. Filters apply to all sections below.
      </p>

      {/* ONE control bar for the entire page */}
      <Suspense fallback={null}>
        <FilterBar itemsForOptions={all} />
      </Suspense>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Products</h2>
        <GalleryList collection="products" items={products} basePath="portfolio" />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <GalleryList collection="projects" items={projects} basePath="portfolio" />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Services</h2>
        <GalleryList collection="services" items={services} basePath="portfolio" />
      </section>
    </main>
    </>
  );
};

export default Dashboard