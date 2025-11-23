import { create } from "zustand";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  source: "voice" | "email" | "text" | "image";
  mood?: string;
  tags?: string[];
  embeddings?: number[];
}

interface JournalState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isLoading: boolean;
  addEntry: (entry: JournalEntry) => void;
  setEntries: (entries: JournalEntry[]) => void;
  setCurrentEntry: (entry: JournalEntry | null) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  currentEntry: null,
  isLoading: false,
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),
  setEntries: (entries) => set({ entries }),
  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
