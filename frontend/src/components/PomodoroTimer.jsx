"use client";

import { useEffect, useState } from "react";
import { Play, Pause, Square } from "lucide-react";

const PHASES = [
  { id: "pomodoro1", label: "Pomodoro", duration: 25 * 60 },
  { id: "break", label: "Break", duration: 5 * 60 },
  { id: "pomodoro2", label: "Pomodoro", duration: 25 * 60 },
  { id: "done", label: "Done", duration: 0 },
];

export default function PomodoroTimer() {
  const [phaseIndex, setPhaseIndex] = useState(0); // 0..3
  const [remainingSeconds, setRemainingSeconds] = useState(PHASES[0].duration);
  const [isRunning, setIsRunning] = useState(false);

  // Format minutes and seconds for display
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  // Handle ticking + phase changes
  useEffect(() => {
    if (!isRunning) return;

    // If we're in the final "Done" phase, stop
    if (phaseIndex === PHASES.length - 1) {
      setIsRunning(false);
      return;
    }

    // If current phase is over, move to next phase
    if (remainingSeconds <= 0) {
      const nextIndex = phaseIndex + 1;
      setPhaseIndex(nextIndex);

      if (nextIndex < PHASES.length - 1) {
        setRemainingSeconds(PHASES[nextIndex].duration);
        return;
      } else {
        // We reached "Done"
        setRemainingSeconds(0);
        setIsRunning(false);
        return;
      }
    }

    // Normal ticking
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phaseIndex, remainingSeconds]);

  const handlePlayPause = () => {
    // If we're at Done with 0 seconds, restart from beginning
    if (phaseIndex === PHASES.length - 1 && remainingSeconds === 0) {
      setPhaseIndex(0);
      setRemainingSeconds(PHASES[0].duration);
      setIsRunning(true);
      return;
    }

    setIsRunning((prev) => !prev);
  };

  const handleStop = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setRemainingSeconds(PHASES[0].duration);
  };

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="w-full max-w-sm mx-auto p-4 rounded-2xl bg-white shadow-sm flex flex-col gap-6">
      {/* Phase / Progress Bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-semibold text-gray-700">
          {currentPhase.label === "Done"
            ? "Done"
            : `Phase: ${currentPhase.label}`}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between">
            {PHASES.map((phase, index) => {
              const isCompleted = index < phaseIndex;
              const isCurrent = index === phaseIndex;
              const isActiveOrCompleted = index <= phaseIndex;

              return (
                <div
                  key={phase.id}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Label */}
                  <span className="text-[10px] sm:text-xs mb-1 text-gray-600 text-center">
                    {phase.label}
                  </span>

                  {/* Dot + Connectors */}
                  <div className="flex items-center w-full">
                    {/* Left connector */}
                    {index !== 0 && (
                      <div
                        className={`h-1 flex-1 ${
                          isCompleted ? "bg-purple-500" : "bg-gray-300"
                        }`}
                      />
                    )}

                    {/* Dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isActiveOrCompleted
                          ? "bg-purple-500 border-purple-500"
                          : "bg-gray-200 border-gray-300"
                      } ${isCurrent ? "scale-110" : ""}`}
                    />

                    {/* Right connector */}
                    {index !== PHASES.length - 1 && (
                      <div
                        className={`h-1 flex-1 ${
                          phaseIndex > index ? "bg-purple-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Display Row */}
      <div className="flex items-center justify-center gap-4">
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ecf3ef] rounded-xl px-6 py-4 min-w-[80px] flex items-center justify-center">
            <span className="text-3xl font-mono font-semibold text-gray-800">
              {minutes}
            </span>
          </div>
          <span className="mt-1 text-xs font-medium text-gray-600">
            Minutes
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ecf3ef] rounded-xl px-6 py-4 min-w-[80px] flex items-center justify-center">
            <span className="text-3xl font-mono font-semibold text-gray-800">
              {seconds}
            </span>
          </div>
          <span className="mt-1 text-xs font-medium text-gray-600">
            Seconds
          </span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-center gap-4">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={handlePlayPause}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-sm bg-purple-500 text-white text-sm font-semibold active:scale-95 transition"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play</span>
            </>
          )}
        </button>

        {/* Stop / Reset */}
        <button
          type="button"
          onClick={handleStop}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold bg-gray-50 active:scale-95 transition"
        >
          <Square className="w-4 h-4" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
