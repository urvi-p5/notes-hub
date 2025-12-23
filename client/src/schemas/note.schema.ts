import { z } from 'zod';

export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(5, 'Content must be at least 5 characters')
    .max(5000, 'Content must not exceed 5000 characters'),
});

export const UpdateNoteSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  content: z
    .string()
    .min(5, 'Content must be at least 5 characters')
    .max(5000, 'Content must not exceed 5000 characters')
    .optional(),
});

export type CreateNoteFormData = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof UpdateNoteSchema>;
