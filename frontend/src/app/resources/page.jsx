"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, LifeBuoy, GraduationCap, ExternalLink } from "lucide-react";

const TABS = [
  { id: "all", label: "All" },
  { id: "stress", label: "Stress Management" },
  { id: "academic", label: "Academic Success" },
];

const SECTIONS = [
  {
    id: "coping",
    title: "Coping Strategies",
    category: "stress",
    icon: BookOpen,
    items: [
      {
        title: "Stress Management Techniques",
        description: "Learn techniques to manage stress effectively.",
        link: "https://www.mhanational.org/stress-management",
      },
      {
        title: "Relaxation Exercises",
        description: "Discover relaxation methods to calm your mind.",
        link: "https://www.verywellmind.com/relaxation-techniques-3144665",
      },
      {
        title: "Wellness Tips",
        description: "Tips for maintaining a healthy lifestyle.",
        link: "https://www.cdc.gov/chronicdisease/resources/infographic/healthy-lifestyle.htm",
      },
    ],
  },
  {
    id: "campus-support",
    title: "Campus Support",
    category: "stress",
    icon: LifeBuoy,
    items: [
      {
        title: "Counseling Services",
        description: "Access mental health services on campus.",
        link: "https://www.opencounseling.com/student-counseling",
      },
      {
        title: "Support Groups",
        description: "Find support groups for various needs.",
        link: "https://www.nami.org/Support-Education/Support-Groups",
      },
      {
        title: "Emergency Contacts",
        description: "Contact information for campus emergency services.",
        link: "https://www.ready.gov/college-campus-emergencies",
      },
    ],
  },
  {
    id: "academic-success",
    title: "Academic Success",
    category: "academic",
    icon: GraduationCap,
    items: [
      {
        title: "Study Skills",
        description: "Strategies for effective studying.",
        link: "https://www.cornell.edu/life-at-cornell/study-skills",
      },
      {
        title: "Time Management",
        description: "Tips for managing your time effectively.",
        link: "https://www.mindtools.com/a4wo118/time-management",
      },
      {
        title: "Academic Writing",
        description: "Resources for academic writing and research.",
        link: "https://owl.purdue.edu/owl/purdue_owl.html",
      },
    ],
  },
];

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const visibleSections = useMemo(() => {
    if (activeTab === "all") return SECTIONS;
    return SECTIONS.filter((s) => s.category === activeTab);
  }, [activeTab]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Resources</h1>

      {/* Tabs */}
      <div className="mt-5 sm:mt-6 border-b border-border">
        <div className="overflow-x-auto">
          <nav className="-mb-px flex gap-6 sm:gap-8 text-sm whitespace-nowrap">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative pb-3 transition-colors flex-shrink-0",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sections */}
      <section className="mt-8 sm:mt-10 space-y-8 sm:space-y-12">
        {visibleSections.map((section) => (
          <ResourceSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            items={section.items}
          />
        ))}
      </section>
    </main>
  );
};

export default ResourcesPage;

/* ---------------------- Components ---------------------- */

const ResourceSection = ({ title, icon: Icon, items }) => {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <ResourceItem key={item.title} icon={Icon} {...item} />
        ))}
      </div>
    </div>
  );
};

const ResourceItem = ({ icon: Icon, title, description, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 sm:gap-4 rounded-xl border border-border/60 bg-card px-3 py-3 sm:px-4 sm:py-3 shadow-sm hover:bg-accent transition-colors group"
    >
      <div className="mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground flex items-center gap-1">
          <span className="truncate">{title}</span>
          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-70 transition flex-shrink-0" />
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </a>
  );
};
