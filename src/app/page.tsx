"use client";

import React, { useState, useRef, useEffect } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"; // Import Progress component
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
} from "@/components/ui/alert-dialog";

interface Note {
  id: number;
  content: string;
  imageUrl?: string;
  timestamp: number; // Add timestamp
}

const HORRIBLE_BACKGROUND_COLORS = [
  "bg-red-500", "bg-lime-400", "bg-fuchsia-700", "bg-cyan-300", "bg-yellow-600",
  "bg-orange-800", "bg-purple-500", "bg-emerald-600", "bg-pink-300", "bg-indigo-900"
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [newNoteImage, setNewNoteImage] = useState<File | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null); // State for editing
  const [mainBgColor, setMainBgColor] = useState<string>("bg-card"); // State for main background
  const [savingProgress, setSavingProgress] = useState<number>(0); // State for fake saving progress
  const [isSaving, setIsSaving] = useState<boolean>(false); // State to show/hide progress bar

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputClearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const addSoundRef = useRef<HTMLAudioElement>(null);
  const deleteSoundRef = useRef<HTMLAudioElement>(null);

  // Effect to clear input after a delay
  useEffect(() => {
    if (inputClearTimerRef.current) {
      clearTimeout(inputClearTimerRef.current);
    }
    inputClearTimerRef.current = setTimeout(() => {
      if (newNoteContent.length > 0 && !editingNoteId) { // Don't clear if editing
        setNewNoteContent("");
        toast.warning("Your thoughts are fleeting! Input cleared!", {
          duration: 1500,
          position: "top-right",
        });
      }
    }, 5000); // Clears after 5 seconds of inactivity

    return () => {
      if (inputClearTimerRef.current) {
        clearTimeout(inputClearTimerRef.current);
      }
    };
  }, [newNoteContent, editingNoteId]);

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Rewind to start
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const startFakeSaving = () => {
    setIsSaving(true);
    setSavingProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        setIsSaving(false);
        setSavingProgress(0);
      } else {
        setSavingProgress(progress);
      }
    }, 300); // Very slow progress
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim() && !newNoteImage) {
      toast.error("You must enter some text or upload an image to add a note!", {
        duration: 1000,
        position: "top-center",
      });
      return;
    }

    let imageUrl: string | undefined;
    if (newNoteImage) {
      imageUrl = URL.createObjectURL(newNoteImage);
    }

    const newNote: Note = {
      id: Date.now(),
      content: newNoteContent,
      imageUrl: imageUrl,
      timestamp: Date.now() + Math.floor(Math.random() * 1000000000), // Random, unhelpful timestamp
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNewNoteContent("");
    setNewNoteImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    playSound(addSoundRef);
    startFakeSaving();
    toast.success("Note added! (But it won't save, haha!)", {
      duration: 1500,
      position: "bottom-right",
    });
  };

  const handleSaveEdit = () => {
    if (editingNoteId === null) return;

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === editingNoteId ? { ...note, content: newNoteContent } : note
      )
    );
    setEditingNoteId(null);
    // newNoteContent is intentionally not cleared here to be annoying
    playSound(addSoundRef); // Use add sound for edit too
    startFakeSaving();
    toast.success("Note 'saved'! (Still won't save, though!)", {
      duration: 1500,
      position: "bottom-right",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNoteImage(e.target.files[0]);
      toast.info("Image selected! Hope it looks bad!", {
        duration: 1000,
        position: "top-left",
      });
    }
  };

  const handleDeleteRandomNote = () => {
    if (notes.length === 0) {
      toast.error("No notes to delete! You're safe... for now.", {
        duration: 1000,
        position: "bottom-center",
      });
      return;
    }
    const randomIndex = Math.floor(Math.random() * notes.length);
    const deletedNoteContent = notes[randomIndex].content.substring(0, 20) + "...";
    setNotes((prevNotes) => prevNotes.filter((_, index) => index !== randomIndex));
    playSound(deleteSoundRef);
    toast.warning(`A random note was obliterated! (${deletedNoteContent})`, {
      duration: 2000,
      position: "top-center",
    });
  };

  const handleEditClick = (note: Note) => {
    setNewNoteContent(note.content);
    setEditingNoteId(note.id);
    toast.info("Editing a note! Good luck finding it!", {
      duration: 1000,
      position: "top-center",
    });
  };

  const handleRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * HORRIBLE_BACKGROUND_COLORS.length);
    setMainBgColor(HORRIBLE_BACKGROUND_COLORS[randomIndex]);
    toast.info("New background! Your eyes will thank me later... or not.", {
      duration: 1500,
      position: "bottom-left",
    });
  };

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-auto">
      <audio ref={addSoundRef} src="/add-sound.mp3" preload="auto" />
      <audio ref={deleteSoundRef} src="/delete-sound.mp3" preload="auto" />

      <main className={`flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl p-4 border-8 border-primary ${mainBgColor} text-card-foreground shadow-2xl transform rotate-3 scale-95 transition-colors duration-300`}>
        <h1 className="text-5xl font-extrabold text-destructive mb-8 text-center w-full animate-pulse animate-ping animate-bounce">
          The WORST Note App EVER!
        </h1>

        <div className="w-full flex flex-col gap-4 p-6 border-4 border-accent bg-secondary shadow-inner -rotate-2">
          <label htmlFor="note-content" className="text-xl font-bold text-accent-foreground mb-2 block">
            Type Your Horrible Note Here:
          </label>
          <Textarea
            id="note-content"
            placeholder="Enter your uninspired thoughts..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full p-4 border-4 border-input bg-popover text-popover-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring focus:ring-offset-4 focus:ring-offset-background resize-none h-32 text-lg font-mono"
          />
          <div className={`text-right text-sm font-bold ${newNoteContent.length > 100 ? 'text-destructive animate-pulse' : 'text-muted-foreground animate-bounce'}`}>
            Characters: {newNoteContent.length} (Who cares?)
          </div>

          <label htmlFor="image-upload" className="text-xl font-bold text-accent-foreground mb-2 block mt-4">
            Upload a Pointless Image:
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full p-4 border-4 border-input bg-popover text-popover-foreground file:text-primary file:bg-primary-foreground file:border-2 file:border-primary file:p-2 file:rounded-full file:mr-4 cursor-grab"
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full p-6 text-3xl font-black bg-primary text-primary-foreground hover:bg-destructive hover:text-destructive-foreground border-8 border-destructive shadow-lg transform skew-x-12 mt-6"
              >
                {editingNoteId ? "SAVE THIS EDIT!" : "ADD THIS MESS!"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card text-card-foreground border-destructive border-4">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive text-3xl font-extrabold">Are you ABSOLUTELY sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-foreground text-lg">
                  This action cannot be undone. You are about to commit a note to the void. Do you truly wish to proceed with this questionable decision?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-muted hover:text-muted-foreground border-2 border-accent">
                  Hesitate!
                </AlertDialogCancel>
                <AlertDialogAction onClick={editingNoteId ? handleSaveEdit : handleAddNote} className="bg-primary text-primary-foreground hover:bg-destructive hover:text-destructive-foreground border-2 border-primary">
                  Proceed to Chaos!
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isSaving && (
            <div className="w-full mt-4">
              <p className="text-center text-lg text-accent-foreground animate-pulse">"Saving" your non-existent data...</p>
              <Progress value={savingProgress} className="w-full h-4 bg-muted border-4 border-ring animate-spin" indicatorClassName="bg-destructive" />
            </div>
          )}

          <Button
            onClick={handleDeleteRandomNote}
            className="w-full p-6 text-2xl font-black bg-accent text-accent-foreground hover:bg-destructive hover:text-destructive-foreground border-8 border-primary shadow-lg transform -skew-y-6 mt-6"
          >
            DELETE A RANDOM NOTE! (Why not?)
          </Button>

          <Button
            onClick={handleRandomBackground}
            className="w-full p-4 text-xl font-bold bg-popover text-popover-foreground hover:bg-input hover:text-input border-4 border-ring shadow-md transform rotate-12 mt-4"
          >
            CHANGE BACKGROUND (No going back!)
          </Button>
        </div>

        <h2 className="text-4xl font-bold text-muted-foreground mt-12 mb-6 text-center w-full animate-bounce animate-spin">
          Your Fleeting Notes (They'll Vanish!)
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 border-dashed border-8 border-muted bg-background overflow-hidden">
          {notes.length === 0 ? (
            <p className="col-span-full text-center text-2xl text-destructive-foreground font-extrabold animate-pulse">
              No horrible notes yet! Add some to make this even worse!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleEditClick(note)} // Make notes clickable for editing
                className="p-6 border-4 border-secondary bg-card text-card-foreground shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-100 ease-in-out overflow-hidden cursor-not-allowed"
              >
                <p className="text-lg font-serif mb-4 break-words text-foreground">{note.content}</p>
                {note.imageUrl && (
                  <img
                    src={note.imageUrl}
                    alt="Horrible Note Image"
                    className="w-full h-auto object-cover border-8 border-destructive mt-4 transform scale-110 -rotate-12"
                    style={{ maxWidth: '150%', height: 'auto', marginLeft: '-25%' }} // Intentionally bad scaling/positioning
                  />
                )}
                <p className="text-xs text-accent-foreground mt-2 font-bold animate-pulse">
                  Timestamp: {note.timestamp} (Meaningless!)
                </p>
              </div>
            ))
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}