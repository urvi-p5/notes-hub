import axiosInstance from '@/utils/axios';
import { Note, CreateNoteInput, UpdateNoteInput, ApiResponse } from '@/types/note.types';

export const notesApi = {
  /**
   * Fetch all notes
   */
  fetchNotes: async (): Promise<Note[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Note[]>>('/notes');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  },

  /**
   * Fetch a single note by ID
   */
  fetchNoteById: async (id: string): Promise<Note> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Note>>(`/notes/${id}`);
      if (!response.data.data) {
        throw new Error('Note not found');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch note:', error);
      throw error;
    }
  },

  /**
   * Create a new note
   */
  createNote: async (input: CreateNoteInput): Promise<Note> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Note>>(
        '/notes',
        input
      );
      if (!response.data.data) {
        throw new Error('Failed to create note');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  },

  /**
   * Update an existing note
   */
  updateNote: async (id: string, input: UpdateNoteInput): Promise<Note> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Note>>(
        `/notes/${id}`,
        input
      );
      if (!response.data.data) {
        throw new Error('Failed to update note');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  /**
   * Delete a note
   */
  deleteNote: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },
};
