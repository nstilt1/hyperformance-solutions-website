"use client"

import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mediaURL } from "@/lib/mediaURL";

export default function AboutPage() {
  const skills = [
    "Serverless",
    "APIs",
    "Prototyping",
    "Automation",
    "Rust",
    "Cryptography",
    "AWS",
    "Software testing",
    "Open Source",
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      {/* Portrait */}
      <div className="flex justify-center mb-10">
        <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg">
          <Image
            src={mediaURL("images/profile.jpg")}
            alt="Portrait of Noah"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Intro */}
      <h1 className="text-4xl font-bold text-center tracking-tight">
        Hi, I&apos;m Noah Stiltner, the entire engineering team.
      </h1>

      <p className="mt-6 text-lg text-muted-foreground text-center leading-relaxed">
        I design, build, and ship serverless systems, APIs, developer tools, and
        creative technical products. My work spans backend architecture, the intricacies
        of performance, and open‑source contributions.
      </p>

      <Separator className="my-12" />

      {/* Philosophy */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Philosophy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          It&apos;s not about there being a right way to do things and a wrong way,
          rather there is an efficient way and plenty of less efficient ways to do 
          things. I try to explore and weigh all possible options when developing, 
          until I find an option that is superior to all the other options—either 
          in terms of cost or performance. Peformance itself is a form of cost, 
          and when the cloud providers charge by the second, we treat it as such.
        </p>
      </section>

      <Separator className="my-12" />

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Tech Stack
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* CTA */}
      <section className="text-center">
        <p className="text-lg text-muted-foreground mb-6">
          Want to collaborate, need a custom API or automation system, or just
          want to talk shop?
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/contact"
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
          >
            Contact Me
          </a>
          <a
            href="/portfolio"
            className="px-6 py-3 rounded-md border font-medium"
          >
            View Portfolio
          </a>
        </div>
      </section>
    </main>
  );
}
