"use client";

import React, { useState, useRef } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Note {
  id: number;
  content: string;
  imageUrl?: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [newNoteImage, setNewNoteImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    if (!newNoteContent.trim() && !newNoteImage) {
      toast.error("You must enter some text or upload an image to add a note!", {
        duration: 1000, // Make it disappear quickly, but still annoying
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
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNewNoteContent("");
    setNewNoteImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    toast.success("Note added! (But it won't save, haha!)", {
      duration: 1500, // Annoying duration
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

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-auto">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl p-4 border-8 border-primary bg-card text-card-foreground shadow-2xl transform rotate-3 scale-95">
        <h1 className="text-5xl font-extrabold text-destructive mb-8 text-center w-full animate-pulse">
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

          <Button
            onClick={handleAddNote}
            className="w-full p-6 text-3xl font-black bg-primary text-primary-foreground hover:bg-destructive hover:text-destructive-foreground border-8 border-destructive shadow-lg transform skew-x-12 mt-6"
          >
            ADD THIS MESS!
          </Button>
        </div>

        <h2 className="text-4xl font-bold text-muted-foreground mt-12 mb-6 text-center w-full animate-bounce">
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
                className="p-6 border-4 border-secondary bg-card text-card-foreground shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-100 ease-in-out overflow-hidden"
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
              </div>
            ))
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}