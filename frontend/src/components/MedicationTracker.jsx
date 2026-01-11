"use client"

import React, { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useLongPress from "@/hooks/useLongPress";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MedicationTracker = () => {

    /* Add medication stuff */
    const [medicationId, setMedicationId] = useState("");
    const [medicationTime, setMedicationTime] = useState(null);
    const [medicationDosage, setMedicationDosage] = useState(null);

    const addMedication = () => {
        if (medicationId.trim() == "") {
            alert("You must use an identifier for this medication. It doesn't need to resemble the medication's name or brand, but you need to be able to know what it is by looking at it.");
            return;
        }
        if (medicationTime == null || !medicationTime) {
            alert("You must enter a time that you're supposed to take this medication");
            return;
        }
        const alreadyExists = medicationData.some(
            (med) => med.id === medicationId
        );
        if (alreadyExists) {
            alert("A medication with this ID already exists. Please choose a different identifier.");
            return;
        }
        
        // create new medication data
        const newMedication = {
            id: medicationId,
            time: medicationTime,
            dosage: medicationDosage || null,
            lastTaken: null,
        };

        setMedicationData([...medicationData, newMedication].sort((a, b) => a.time.localeCompare(b.time)));

        // reset fields
        setMedicationId("");
        setMedicationDosage(null);
        setMedicationTime(null);
        document.getElementById("dialog-close-med-tracker").click();
    };

    /* Take meds logic 
        Take meds if hours since last taken is greater than 6 and current time > time

        Set to 6 in case someone takes their meds super late to stay up for 
        something like an assignment
    */
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);

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

    const formatLastTaken = (iso) => {
        if (!iso) return "Never";

        const taken = new Date(iso);
        const now = new Date();

        const mmdd = taken.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
        });

        const hhmm = taken.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
        });

        const diffMs = now - taken;
        const diffH = Math.floor(diffMs / (1000 * 60 * 60));
        const diffM = Math.floor(diffMs / (1000 * 60)) % 60;

        return `${mmdd} ${hhmm}\n${diffH}h${diffM.toString().padStart(2, "0")}m ago`;
    }

    /* Rerender for time since last dose to update */
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((t) => t + 1); // trigger rerender
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Press & hold menu state
    const [menuOpen, setMenuOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedMed, setSelectedMed] = useState(null);
    const [newMedName, setNewMedName] = useState("");

    // Open the hold menu
    function openMenu(med) {
    setSelectedMed(med);
    setMenuOpen(true);
    }

    // Edit logic
    function confirmEdit() {
        setMedicationData(prev =>
            prev.map(m =>
            m.id === selectedMed.id
                ? { ...m, id: newMedName, time: selectedMed.time }
                : m
            )
        );
        setEditOpen(false);
    }


    // Delete logic
    function confirmDelete() {
    setMedicationData(prev =>
        prev.filter(m => m.id !== selectedMed.id)
    );
    setDeleteOpen(false);
    }


    /* Persistent */
    const [medicationData, setMedicationData] = useLocalStorage("meds", []);
    
  return (
    <>
    <div className=" md:ml-10 md:px-8 sm:px-4 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <h1 className="text-4xl font-bold tracking-tight mt-2">Medication Tracker</h1>
        <p className="text-lg leading-relaxed text-gray-700 mt-2">
            Keep track of your medications and set reminders to ensure you never 
            miss a dose. This tool helps you manage your medications effectively.
        </p>
        {/* Confirm take medication dialog */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen} className="z-index-[150]">
            <AlertDialogPortal>
            <AlertDialogContent className="z-index-[200]">
                <AlertDialogHeader>
                <AlertDialogTitle>Take Medication?</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to record a dose for{" "}
                    <strong>{selectedMedication?.id}</strong>?
                </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                    const now = new Date().toISOString();
                    const updated = medicationData.map(m =>
                        m.id === selectedMedication.id
                        ? { ...m, lastTaken: now }
                        : m
                    );
                    setMedicationData(updated);
                    setConfirmOpen(false);
                    }}
                >
                    Confirm
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogPortal>
            </AlertDialog>

        {/* Add Medication dialog */}
        <Dialog>
            <form onSubmit={addMedication}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add New Medication</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Medication</DialogTitle>
                        <DialogDescription>Add a new medication using this form.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                          {[
                            { label: 'ID e.g. "Night Meds".', value: medicationId, set: setMedicationId, required: true, type: "text"},
                            { label: "Time", value: medicationTime, set: setMedicationTime, required: true, type: "time"},
                        ].map(({ label, value, set, required, type }) => (
                            <div key={label} className="grid gap-3">
                            <Label>{label}</Label>
                            <Input
                                type={type}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                required={required}
                            />
                            </div>
                        ))}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" id="dialog-close-med-tracker">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={() => addMedication()}>Add</Button>
                        </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
        {/* Medication cards */}
        <div className="mt-8 flex flex-col gap-6">
            {medicationData.length === 0 && (
                <p className="text-gray-500 italic">No medications added yet.</p>
            )}

            {medicationData.map((medication) => {
                const formattedTime = new Date(`2000-01-01T${medication.time}`)
                .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });

                return (
                <Card key={medication.id} className="w-full shadow-md border border-gray-200">
                    <CardHeader>
                    <CardTitle className="text-xl font-semibold">{medication.id}</CardTitle>
                    <CardDescription>
                        Take at <strong>{formattedTime}</strong>
                    </CardDescription>
                    </CardHeader>

                    <CardContent>
                    <p className="text-sm whitespace-pre-line">
                        Last taken: {formatLastTaken(medication.lastTaken)}
                    </p>
                    </CardContent>

                    <CardFooter className="flex justify-between gap-3">
                    {/* TAKE MEDS BUTTON */}
                    <Button
                        variant="outline"
                        className={isOverdue(medication) ? "animate-pulse-red" : ""}
                        onClick={() => {
                        setSelectedMedication(medication);
                        setConfirmOpen(true);
                        }}
                    >
                        Take Medication
                    </Button>

                    {/* OPTIONS BUTTON */}
                    <Button
                        variant="secondary"
                        onClick={() => {
                        setSelectedMed(medication);
                        setMenuOpen(true);
                        }}
                    >
                        Options
                    </Button>
                    </CardFooter>
                </Card>
                );
            })}
        </div>
        
        {/* Edit/Delete meds menu */}
        {menuOpen && selectedMed && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
            <div className="bg-white w-full rounded-t-xl p-4">
            <button
                className="w-full text-left p-3 hover:bg-gray-100"
                onClick={() => {
                setMenuOpen(false);
                setNewMedName(selectedMed.id);
                setEditOpen(true);
                }}
            >
                Edit &quot;{selectedMed.id}&quot;
            </button>

            <button
                className="w-full text-left p-3 text-red-600 hover:bg-red-50"
                onClick={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
                }}
            >
                Delete &quot;{selectedMed.id}&quot;
            </button>

            <button
                className="w-full text-center p-3 mt-2 text-gray-600"
                onClick={() => setMenuOpen(false)}
            >
                Cancel
            </button>
            </div>
        </div>
        )}
        {/*Edit Medication Dialog*/}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
                Enter a new name for &quot;{selectedMed?.id}&quot;.
            </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-3">
                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Time</Label>
                    <Input
                    type="time"
                    value={selectedMed?.time || ""}
                    onChange={(e) =>
                        setSelectedMed((prev) => ({ ...prev, time: e.target.value }))
                    }
                    />
                </div>
            </div>


            <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmEdit}>Save</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        {/*Delete Confirmation Dialog*/}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Remove Medication?</DialogTitle>
            <DialogDescription>
                Are you sure you want to remove &quot;{selectedMed?.id}&quot;?
            </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button variant="destructive" onClick={confirmDelete}>
                Delete
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        {/* Help Menu */}
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline"
                    className="fixed bottom-4 right-4 rounded-full w-12 h-12 text-xl font-bold bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                >?!</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Help &amp; FAQs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            <AccordionItem value="threw-up">
                                <AccordionTrigger>I threw up my meds. What should I do?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance">
                                    <p>
                                        It depends on a number of factors, such as how long ago you 
                                        took the dose, if it was extended release or not, and several 
                                        other factors.
                                    </p>
                                    <p>
                                        If your doctor&apos;s office is open, you should call them. 
                                        Otherwise, you can try a pharmacy (preferably your pharmacy) 
                                        but if they are closed then you could try calling a 24/7 
                                        pharmacy. <a
                                            href="https://www.google.com/search?q=open+pharmacies+near+me"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                            >
                                            Find open pharmacies near me.
                                        </a>
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="took-too-much">
                                <AccordionTrigger>I accidentally took too much. What should I do?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance">
                                    <p>
                                        There are some factors at play here, but if you live in the 
                                        United States, you can call the poison control hotline and they 
                                        will be able to help you make a safe decision. <a
                                            href="tel:1-800-222-1222"
                                            className="text-red-600 underline hover:text-red-800 font-semibold"
                                            >
                                            Call Poison Control: 1-800-222-1222
                                        </a>

                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
    </>
  );
};

export default MedicationTracker