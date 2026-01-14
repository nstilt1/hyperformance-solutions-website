// maybe implement the dashboard in `src/app/page.js`
import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import ImageCard from "@/components/ImageCard";
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
Amplify.configure(config);
const Dashboard = () => {


  return (
    <>
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
      <h1 className="text-4xl font-bold tracking-tight mt-2 pb-5">Welcome back!</h1>
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
            </div>
          </a>
        </div>
      </div>

    </div>
    </>
  );
};

export default Dashboard