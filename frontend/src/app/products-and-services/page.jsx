"use client"

import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import BreathingGuide from "@/components/BreathingGuide";
import MedicationTracker from "@/components/MedicationTracker";

const MindfulnessAndMedication = () => {
  return (
    <>
        <BreathingGuide />
        <MedicationTracker />
    </>
  );
};

export default MindfulnessAndMedication