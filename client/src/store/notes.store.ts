import { create } from 'zustand';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note.types';

interface NotesStore {
  notes: Note[];
  loading: boolean;
  error: string | null;
  selectedNote: Note | null;

  // Actions
  setNotes: (notes: Note[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedNote: (note: Note | null) => void;

  // CRUD Operations
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  clearNotes: () => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  loading: false,
  error: null,
  selectedNote: null,

  setNotes: (notes) => set({ notes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedNote: (note) => set({ selectedNote: note }),

  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes],
      error: null,
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
      selectedNote:
        state.selectedNote?.id === id
          ? { ...state.selectedNote, ...updates }
          : state.selectedNote,
      error: null,
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
      error: null,
    })),

  clearNotes: () =>
    set({
      notes: [],
      selectedNote: null,
      error: null,
    }),
}));
