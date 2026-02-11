"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const phrases = [
    "We do it all",
    "Serverless APIs",
    "Automation",
    "Developer Tools",
    "Open Source",
    "Creative Engineering",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Building scalable systems, APIs, and products.
      </h1>

      <div className="relative mt-4 h-10 overflow-hidden">
        <p
            key={phrases[index]}
            className="text-xl font-medium animate-slide-up absolute inset-0 flex items-center justify-center"
        >
            {phrases[index]}
        </p>
        </div>


      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <a href="#portfolio">View Portfolio</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/contact">Contact</a>
        </Button>
      </div>
    </section>
  );
}
