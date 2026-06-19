// Zod schemas used by both the API (tRPC input) AND the web (form validation).
// A single source of truth → no drift between frontend and backend.
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  body: z.string().max(10_000).default(""),
});

export const updateNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  body: z.string().max(10_000).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
