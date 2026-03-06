"use client";

import { useState } from "react";
import { StickyNote, Plus, X } from "lucide-react";

interface QuickNotesProps {
  notes: string[];
  onNotesChange: (notes: string[]) => void;
}

const QUICK_TEMPLATES = [
  "Bedenken wegen Schmerzen",
  "Interessiert sich auch für Gesicht",
  "Termin lieber nachmittags",
  "Empfindliche Haut",
  "Erstberatung",
  "Will Partner mitbringen",
  "Preis vergleichen",
  "Finanzierung gewünscht",
];

const QuickNotes = ({ notes, onNotesChange }: QuickNotesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customNote, setCustomNote] = useState("");

  const addNote = (note: string) => {
    if (note.trim() && !notes.includes(note.trim())) {
      onNotesChange([...notes, note.trim()]);
    }
    setCustomNote("");
  };

  const removeNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    onNotesChange(newNotes);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customNote.trim()) {
      addNote(customNote);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Schnelle Notizen</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Aktuelle Notizen */}
            {notes.length > 0 && (
              <div className="mb-3 space-y-1">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-200">{note}</span>
                    <button
                      onClick={() => removeNote(index)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Eigene Notiz eingeben */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Eigene Notiz..."
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-main-color"
              />
              <button
                onClick={() => addNote(customNote)}
                disabled={!customNote.trim()}
                className="px-2 py-1 bg-main-color text-white rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Schnellauswahl */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Schnellauswahl:</p>
            <div className="flex flex-wrap gap-1">
              {QUICK_TEMPLATES.filter((t) => !notes.includes(t)).map((template) => (
                <button
                  key={template}
                  onClick={() => addNote(template)}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  + {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickNotes;
