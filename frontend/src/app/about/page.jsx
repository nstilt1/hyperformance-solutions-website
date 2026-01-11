"use client"

import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import MoodTracker from "@/components/MoodTracker"; // adjust path if yours is different
import MoodTrends from "@/components/MoodTrends";


const Mood = () => {
  return (
    <>
        <MoodTracker />

    </>
  );
};

export default Mood