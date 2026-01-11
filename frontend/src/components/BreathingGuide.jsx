"use client"

import { cn } from "@/lib/utils"
import React, { useState, useRef, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { 
    Select, 
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Trash, Plus, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const BreathingGuide = () => {
    const minSize = 90;
    const maxSize = 300;
    const [size, setSize] = useState(minSize);
    const [state, setState] = useState(1);
    const [remainingTime, setRemainingTime] = useState(0);
    const [paused, setPaused] = useState(false);

    const [settingsOpen, setSettingsOpen] = useState(false);

    const [preset, setPreset] = useLocalStorage("breathingExercise", "4-4-4-4");
    const [presets, setPresets] = useLocalStorage("breathingExercises", 
        ["4-4-4-4", "4-7-8-0", "5-0-5-0"]
    );

    const [growDuration, setGrowDuration] = useState(0);
    const [growHoldDuration, setGrowHoldDuration] = useState(0);
    const [shrinkDuration, setShrinkDuration] = useState(0);
    const [shrinkHoldDuration, setShrinkHoldDuration] = useState(0);

    useEffect(() => {
        if (preset == null) {
            setGrowDuration(0);
            setGrowHoldDuration(0);
            setShrinkDuration(0);
            setShrinkHoldDuration(0);
            setState(1);
            setSize(minSize);
            startTimeRef.current = null;
            return;
        }
        const durations = preset.split('-').map(Number);

        if (durations.length === 4) {
            setGrowDuration(durations[0] * 1000);
            setGrowHoldDuration(durations[1] * 1000);
            setShrinkDuration(durations[2] * 1000);
            setShrinkHoldDuration(durations[3] * 1000);
        }
        setState(1);
        setSize(minSize);
        startTimeRef.current = null;
    }, [preset]);

    const requestRef = useRef();
    const startTimeRef = useRef(null);

    const animate = (timestamp) => {
        if (preset == null || paused) {
            return;
        }
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        
        let duration = 0;

            if (state === 1) {
                duration = growDuration;
                const progress = Math.min(elapsed / growDuration, 1);
                setSize(minSize + (maxSize - minSize) * progress);
                setRemainingTime(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
                if (progress >= 1) {
                    setState(2);
                    startTimeRef.current = null;
                }
            } else if (state === 2) {
                duration = growHoldDuration;
                setRemainingTime(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
                if (elapsed >= growHoldDuration) {
                    setState(3);
                    startTimeRef.current = null;
                }
            } else if (state === 3) {
                duration = shrinkDuration;
                const progress = Math.min(elapsed / shrinkDuration, 1);
                setSize(maxSize - (maxSize - minSize) * progress);
                setRemainingTime(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
                if (progress >= 1) {
                    setState(4);
                    startTimeRef.current = null;
                }
            } else if (state === 4) {
                duration = shrinkHoldDuration;
                setRemainingTime(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
                if (elapsed >= shrinkHoldDuration) {
                    setState(1);
                    startTimeRef.current = null;
                }
            }
            requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        if(!paused) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [state, paused]);

    /* saving stuff */
    const [inhale, setInhale] = useState(0);
    const [holdIn, setHoldIn] = useState(0);
    const [exhale, setExhale] = useState(0);
    const [holdOut, setHoldOut] = useState(0);

    const handleSave = (e) => {
        console.log("Saved");
        const newPreset = `${inhale}-${holdIn}-${exhale}-${holdOut}`;
        if (inhale == 0 || exhale == 0) {
            alert("Inhale and exhale time must not equal 0.");
        } else if (!presets.includes(newPreset)) {
            setPresets([...presets, newPreset]);
            document.getElementById("dialog-close").click();
            resetAnimation();
        } else {
            alert("Preset already exists.");
        }
    }

    const resetAnimation = () => {
        cancelAnimationFrame(requestRef.current); // stop any existing loop
        setState(1);
        setSize(minSize);
        startTimeRef.current = null;
        requestRef.current = requestAnimationFrame(animate); // start fresh
    };


    return (
    <>
    <div className=" md:ml-10 md:px-8 sm:px-4 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <h1 className="text-4xl font-bold tracking-tight mt-2">Breathing Guide</h1>
        <p className="text-lg leading-relaxed text-gray-700 mt-2">
            Follow the visual cues to regulate your breathing. Inhale as the circle 
            expands, and exhale as it contracts. This exercise helps to calm your 
            mind and reduce stress.
        </p>
        <div className="flex gap-2 mt-4 justify-center">
        <Select onValueChange={(value) => setPreset(value)} value={preset}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a breathing exercise" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            {presets.map((presetValue) => (
                <SelectItem key={presetValue} value={presetValue}>
                {presetValue}
                </SelectItem>
            ))}
            </SelectGroup>
        </SelectContent>
        </Select>

        <Dialog>
            <form onSubmit={handleSave}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent className="w-full rounded-lg max-w-[95vw] sm:max-w-md px-4 py-6">
                    <DialogHeader>
                        <DialogTitle>Add Breathing Exercises</DialogTitle>
                        <DialogDescription>Create a breathing exercise here. Click save when you are done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {[
                        { label: "Inhale", value: inhale, set: setInhale },
                        { label: "Hold In", value: holdIn, set: setHoldIn },
                        { label: "Exhale", value: exhale, set: setExhale },
                        { label: "Hold Out", value: holdOut, set: setHoldOut },
                        ].map(({ label, value, set }) => (
                        <div key={label} className="grid gap-3">
                            <Label>{label}: {value}s</Label>
                            <Slider
                            value={[value]}
                            onValueChange={([v]) => set(v)}
                            max={12}
                            step={1}
                            className="w-full max-w-xs"
                            />
                        </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" id="dialog-close">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={() => handleSave()}>Save Preset</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this breathing exercise?</AlertDialogTitle>
                    <AlertDialogDescription>
                        If you delete this breathing exercise, you will have to add it back to use it again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        const updatedPresets = presets.filter(p => p != preset);
                        setPresets(updatedPresets);
                        setPreset(null);
                        resetAnimation();
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
        <div className="flex gap-2 mt-4 justify-center">
            <Button
                variant="outline"
                onClick={() => setPaused((prev) => !prev)}
                className="flex items-center gap-2"
            >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {paused ? "Resume" : "Pause"}
            </Button>
        </div>
        <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
        }}>
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                transition: 'width 0.1s, height 0.1s',
            }}
            >
                <div style={{ textAlign: "center" }}>
                    <div>
                        {state === 1 && "In"}
                        {state === 2 && "Hold"}
                        {state === 3 && "Out"}
                        {state === 4 && "Hold"}
                    </div>
                    <div style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                        {remainingTime}s
                    </div>
                    </div>

            </div>
        </div>
    </div>
    </>
  );
};

export default BreathingGuide