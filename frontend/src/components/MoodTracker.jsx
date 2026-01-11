"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";

/* =========================================================
   MoodTracker (faces-only picker + live-updating calendar)
   ========================================================= */
export default function MoodTracker() {
  const [lastSelection, setLastSelection] = useLocalStorage(
    "moodLastSelection",
    { mood: null, intensity: 50 }
  );

  const [mood, setMood] = useState(lastSelection.mood);
  const [intensity, setIntensity] = useState(lastSelection.intensity);
  const [justSaved, setJustSaved] = useState(false);

  // Five fixed faces -> sentiment + intensity buckets
  const faces = useMemo(
    () => [
      { key: "very-sad",   label: "Very sad",   emoji: "😢", value: 20,  sentiment: "Sad" },
      { key: "sad",        label: "Sad",        emoji: "🙁", value: 40,  sentiment: "Sad" },
      { key: "neutral",    label: "Neutral",    emoji: "😐", value: 50,  sentiment: "Neutral" },
      { key: "happy",      label: "Happy",      emoji: "🙂", value: 80,  sentiment: "Happy" },
      { key: "very-happy", label: "Very happy", emoji: "😄", value: 100, sentiment: "Happy" },
    ],
    []
  );

  const save = () => {
    const entry = { date: new Date().toISOString(), mood, intensity };
    try {
      const existing = JSON.parse(localStorage.getItem("moodEntries") || "[]");
      existing.push(entry);
      localStorage.setItem("moodEntries", JSON.stringify(existing));

      // Broadcast to this tab + other tabs
      window.dispatchEvent(new Event("mood:updated"));

      setLastSelection({ mood, intensity });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch (e) {
      console.error("Failed to save mood entry", e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 md:pt-14 pb-16 md:pb-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Mood Tracker
      </h1>
      <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mt-2">
        How are you feeling today?
      </p>

      <div className="mt-8 sm:mt-10 space-y-6">
        {/* Faces grid (selects mood) */}
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {faces.map((f) => {
              const isActive = intensity === f.value && mood === f.sentiment;
              const labelId = `mood-face-${f.key}`;
              return (
                <div key={f.key} className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-describedby={labelId}
                    onClick={() => {
                      if (isActive) {
                        // allow unselect on second click
                        setMood(null);
                        setIntensity(50);
                      } else {
                        setIntensity(f.value);
                        setMood(f.sentiment);
                      }
                    }}
                    className={cn(
                      "h-14 w-14 sm:h-16 sm:w-16 rounded-full border text-2xl flex items-center justify-center",
                      "transition-transform outline-none ring-offset-background",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "scale-105 border-transparent ring-2 ring-foreground ring-offset-2"
                        : "border-muted"
                    )}
                  >
                    <span role="img" aria-hidden>
                      {f.emoji}
                    </span>
                  </button>
                  <span
                    id={labelId}
                    className="text-xs sm:text-sm text-muted-foreground text-center"
                  >
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <Button
            variant="secondary"
            onClick={() => {
              setMood(null);
              setIntensity(50);
            }}
          >
            Reset
          </Button>
          <Button
            onClick={save}
            disabled={mood === null}
            className="min-w-[140px]"
          >
            {justSaved ? "Saved!" : "Save Mood"}
          </Button>
        </div>

        {/* Calendar */}
        <EmojiCalendar />
      </div>
    </div>
  );
}

/* =========================================================
   Emoji Calendar (monthly, live updates)
   ========================================================= */

const fmtKey = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

// Map mood + intensity to the correct emoji + label
const moodEmoji = (mood, intensity) => {
  const n = Number(intensity) || 0;
  if (mood === "Sad")    return n <= 30 ? "😢" : "🙁";   // 20 -> 😢 , 40 -> 🙁
  if (mood === "Happy")  return n >= 95 ? "😄" : "🙂";   // 100 -> 😄, 80 -> 🙂
  if (mood === "Neutral") return "😐";
  return "·";
};
const moodLabel = (mood, intensity) => {
  const n = Number(intensity) || 0;
  if (mood === "Sad")    return n <= 30 ? "Very sad"   : "Sad";
  if (mood === "Happy")  return n >= 95 ? "Very happy" : "Happy";
  if (mood === "Neutral") return "Neutral";
  return "";
};

export function EmojiCalendar() {
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => setMounted(true), []);

  const loadEntries = () => {
    try {
      const arr = JSON.parse(localStorage.getItem("moodEntries") || "[]");
      setEntries(Array.isArray(arr) ? arr : []);
    } catch {
      setEntries([]);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    loadEntries();

    const onCustom = () => loadEntries();
    const onStorage = (e) => {
      if (!e.key || e.key === "moodEntries") loadEntries();
    };

    window.addEventListener("mood:updated", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("mood:updated", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [mounted]);

  const [month, setMonth] = useState(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return startOfMonth(t);
  });

  const entriesByDay = useMemo(() => {
    const map = new Map();
    for (const e of entries) {
      const k = fmtKey(new Date(e.date));
      map.set(k, e); // newest wins
    }
    return map;
  }, [entries]);

  const first = startOfMonth(month);
  const last  = endOfMonth(month);

  // Grid: start on Sunday, end on Saturday
  const startGrid = new Date(first);
  startGrid.setDate(first.getDate() - ((first.getDay() + 7) % 7));
  const endGrid = new Date(last);
  endGrid.setDate(last.getDate() + (6 - ((last.getDay() + 7) % 7)));

  const days = [];
  for (const d = new Date(startGrid); d <= endGrid; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const monthLabelText = month.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="mt-10 sm:mt-12">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-xl sm:text-2xl font-semibold">Mood Calendar</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const m = new Date(month);
              m.setMonth(m.getMonth() - 1);
              setMonth(startOfMonth(m));
            }}
          >
            ←
          </Button>
          <div className="min-w-[10ch] text-center text-sm sm:text-base">
            {monthLabelText}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const m = new Date(month);
              m.setMonth(m.getMonth() + 1);
              setMonth(startOfMonth(m));
            }}
          >
            →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const key = fmtKey(d);
          const entry = mounted ? entriesByDay.get(key) : null;
          const emoji = mounted && entry ? moodEmoji(entry.mood, entry.intensity) : "·";
          const isToday = fmtKey(new Date()) === key;

          return (
            <div
              key={key}
              className={[
                "rounded-lg border p-1.5 sm:p-2 h-20 sm:h-24 flex flex-col items-center justify-between",
                inMonth ? "bg-white" : "bg-muted/30",
                isToday ? "border-foreground" : "border-muted",
              ].join(" ")}
              aria-label={`${d.toDateString()} ${
                entry ? moodLabel(entry.mood, entry.intensity) : ""
              }`}
            >
              <div className="w-full text-[10px] sm:text-xs text-muted-foreground">
                {d.getDate()}
              </div>
              <div className="text-xl sm:text-2xl" aria-hidden suppressHydrationWarning>
                {emoji}
              </div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground h-4 text-center">
                {mounted && entry ? moodLabel(entry.mood, entry.intensity) : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
