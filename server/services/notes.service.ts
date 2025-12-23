import { query } from "../db";
import { Note, CreateNoteInput, UpdateNoteInput } from "../types/note.types";

export const notesService = {
  /**
   * Get all notes ordered by updated_at descending
   */
  getAllNotes: async (): Promise<Note[]> => {
    const result = await query(
      'SELECT id, title, content, created_at as "createdAt", updated_at as "updatedAt" FROM notes ORDER BY updated_at DESC',
    );
    return result.rows as Note[];
  },

  /**
   * Get a single note by ID
   */
  getNoteById: async (id: string): Promise<Note | null> => {
    const result = await query(
      'SELECT id, title, content, created_at as "createdAt", updated_at as "updatedAt" FROM notes WHERE id = $1',
      [id],
    );
    return (result.rows[0] as Note) || null;
  },

  /**
   * Create a new note
   */
  createNote: async (input: CreateNoteInput): Promise<Note> => {
    const result = await query(
      `INSERT INTO notes (title, content) VALUES ($1, $2)
       RETURNING id, title, content, created_at as "createdAt", updated_at as "updatedAt"`,
      [input.title, input.content],
    );
    return result.rows[0] as Note;
  },

  /**
   * Update an existing note
   */
  updateNote: async (
    id: string,
    input: UpdateNoteInput,
  ): Promise<Note | null> => {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (input.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(input.title);
    }

    if (input.content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(input.content);
    }

    if (updates.length === 0) {
      // No updates provided, return existing note
      return notesService.getNoteById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query_string = `
      UPDATE notes
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, title, content, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await query(query_string, values);
    return (result.rows[0] as Note) || null;
  },

  /**
   * Delete a note by ID
   */
  deleteNote: async (id: string): Promise<boolean> => {
    const result = await query("DELETE FROM notes WHERE id = $1", [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },
};
