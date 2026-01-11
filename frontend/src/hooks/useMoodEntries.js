"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "moodEntries";
const UPDATED_EVENT = "mood:updated";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const write = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

export default function useMoodEntries() {
  const [entries, setEntries] = useState([]);

  const reload = useCallback(() => {
    setEntries(read());
  }, []);

  const addEntry = useCallback((entry) => {
    const arr = read();
    arr.push(entry);
    write(arr);
    setEntries(arr);
    // notify same-tab listeners
    window.dispatchEvent(new Event(UPDATED_EVENT));
  }, []);

  const clearEntries = useCallback(() => {
    write([]);
    setEntries([]);
    window.dispatchEvent(new Event(UPDATED_EVENT));
  }, []);

  useEffect(() => {
    reload();

    const onStorage = (e) => {
      if (e.key === KEY) reload();
    };
    const onUpdated = () => reload();

    window.addEventListener("storage", onStorage);
    window.addEventListener(UPDATED_EVENT, onUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(UPDATED_EVENT, onUpdated);
    };
  }, [reload]);

  return { entries, addEntry, clearEntries, reload };
}
