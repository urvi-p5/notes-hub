import { Router, Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { notesService } from "../services/notes.service";
import { ApiResponse } from "../types/note.types";

const router = Router();

// Validation schemas
const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(5, "Content must be at least 5 characters")
    .max(5000, "Content must not exceed 5000 characters"),
});

const UpdateNoteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters")
    .max(5000, "Content must not exceed 5000 characters")
    .optional(),
});

// GET /api/notes - Get all notes
export const getAllNotes: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const notes = await notesService.getAllNotes();
    const response: ApiResponse<typeof notes> = {
      success: true,
      data: notes,
      message: "Notes fetched successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching notes:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch notes",
    };
    res.status(500).json(response);
  }
};

// GET /api/notes/:id - Get a single note
export const getNoteById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const note = await notesService.getNoteById(id);

    if (!note) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Note not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof note> = {
      success: true,
      data: note,
      message: "Note fetched successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching note:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch note",
    };
    res.status(500).json(response);
  }
};

// POST /api/notes - Create a new note
export const createNote: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate request body
    const validatedData = CreateNoteSchema.parse(req.body);

    const note = await notesService.createNote(validatedData);

    const response: ApiResponse<typeof note> = {
      success: true,
      data: note,
      message: "Note created successfully",
    };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.errors[0].message,
      };
      return res.status(400).json(response);
    }

    console.error("Error creating note:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create note",
    };
    res.status(500).json(response);
  }
};

// PUT /api/notes/:id - Update a note
export const updateNote: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Validate request body
    const validatedData = UpdateNoteSchema.parse(req.body);

    // Check if note exists
    const existingNote = await notesService.getNoteById(id);
    if (!existingNote) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Note not found",
      };
      return res.status(404).json(response);
    }

    const note = await notesService.updateNote(id, validatedData);

    const response: ApiResponse<typeof note> = {
      success: true,
      data: note,
      message: "Note updated successfully",
    };
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.errors[0].message,
      };
      return res.status(400).json(response);
    }

    console.error("Error updating note:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to update note",
    };
    res.status(500).json(response);
  }
};

// DELETE /api/notes/:id - Delete a note
export const deleteNote: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Check if note exists
    const existingNote = await notesService.getNoteById(id);
    if (!existingNote) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Note not found",
      };
      return res.status(404).json(response);
    }

    await notesService.deleteNote(id);

    const response: ApiResponse<null> = {
      success: true,
      message: "Note deleted successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error deleting note:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete note",
    };
    res.status(500).json(response);
  }
};

// Register routes
router.get("/notes", getAllNotes);
router.get("/notes/:id", getNoteById);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
