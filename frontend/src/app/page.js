// maybe implement the dashboard in `src/app/page.js`
"use client"

import React, { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import CloudBackground from "@/components/CloudBackground";
import ImageCard from "@/components/ImageCard";

const Dashboard = () => {
  const [medicationData] = useLocalStorage("meds", []);
  const [tasks] = useLocalStorage("task-list", []);   // Your task list
  const [moodEntries] = useLocalStorage("moodEntries", []); // Mood tracker entries
  const [name, setName, isLoaded] = useLocalStorage("nickname", null);

  function getNextDoseText() {
    if (!medicationData || medicationData.length === 0) return "No meds";

    const overdue = medicationData.filter(m => isOverdue(m));
    if (overdue.length > 0) return "Now";

    // find next scheduled time that hasn't passed yet
    const now = new Date();

    const times = medicationData
      .map(m => {
        const [h, min] = m.time.split(":").map(Number);
        const d = new Date(now);
        d.setHours(h, min, 0, 0);
        return d;
      })
      .filter(t => t >= now);

    if (times.length === 0) return "Tomorrow";

    const next = times.sort((a,b) => a - b)[0];

    return next.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const unfinishedCount = tasks?.filter(t => !t.done).length ?? 0;

  function getLastMood() {
    if (!moodEntries || moodEntries.length === 0) return "None";

    const sorted = [...moodEntries].sort(
      (a,b) => new Date(b.date) - new Date(a.date)
    );

    return sorted[0].mood;
  }

  const isOverdue = (medication) => {
    if (!medication.time || medication.lastTaken) return false;

    const now = new Date();
    const [hour, minute] = medication.time.split(":").map(Number);
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hour, minute, 0, 0);

    const lastTaken = new Date(medication.lastTaken);
    const hoursSinceTaken = (now - lastTaken) / (1000 * 60 * 60);

    return now > scheduledTime && hoursSinceTaken > 6;
  }

  return (
    <>
    <CloudBackground />

    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
      <h1 className="text-4xl font-bold tracking-tight mt-2 pb-5">Welcome back, {isLoaded ? (name ?? "boss") : ""}!</h1>
      <div className="pb-5">
        What would you like to do?
      </div>
      <ImageCard
        imageSrc="/images/trees.svg"
        buttonSide="right"
        buttonText="Breathe"
        href="/mindfulness-medication"
        />
      <ImageCard
        imageSrc="/images/focus-woman.png"
        buttonSide="left"
        buttonText="Focus"
        href="/focus"
        />
      <ImageCard
        imageSrc="/images/journal.png"
        buttonSide="right"
        buttonText="Journal"
        href="/mood"
        />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Your Daily Overview</h2>

        <div
          className="flex gap-4 overflow-x-scroll snap-x snap-mandatory pb-4 no-scrollbar"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {/* CARD 1 — NEXT DOSE */}
          <a
            href="/mindfulness-medication/medication-tracker"
            className="min-w-[260px] snap-center rounded-xl overflow-hidden shadow-lg bg-gray-100 relative active:scale-[0.98] transition"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/meds.png')" }}
            ></div>

            <div className="p-4">
              <h3 className="font-bold text-lg">Next Dose</h3>
              <p className="text-gray-700 mt-1">{getNextDoseText()}</p>
            </div>
          </a>

          {/* CARD 2 — UNFINISHED TASKS */}
          <a
            href="/focus"
            className="min-w-[260px] snap-center rounded-xl overflow-hidden shadow-lg bg-gray-100 relative active:scale-[0.98] transition"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/tasks_bg.png')" }}
            ></div>

            <div className="p-4">
              <h3 className="font-bold text-lg">Unfinished Tasks</h3>
              <p className="text-gray-700 mt-1">{unfinishedCount}</p>
            </div>
          </a>

          {/* CARD 3 — LAST MOOD */}
          <a
            href="/mood"
            className="min-w-[260px] snap-center rounded-xl overflow-hidden shadow-lg bg-gray-100 relative active:scale-[0.98] transition"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/mood_bg.png')" }}
            ></div>

            <div className="p-4">
              <h3 className="font-bold text-lg">Last Mood</h3>
              <p className="text-gray-700 mt-1">{getLastMood()}</p>
            </div>
          </a>
        </div>
      </div>

    </div>
    </>
  );
};

export default Dashboard