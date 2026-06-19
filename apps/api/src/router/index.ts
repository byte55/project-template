import { router } from "../trpc.js";
import { noteRouter } from "./note.js";

// Neue Router hier registrieren.
export const appRouter = router({
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
