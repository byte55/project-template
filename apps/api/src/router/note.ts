// Example router. Demonstrates the CRUD pattern with ownership checks:
// every query/mutation filters on the userId of the current session.
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { notes } from "@app/db";
import { createNoteSchema, updateNoteSchema } from "@app/shared";
import { router, protectedProcedure } from "../trpc.js";

export const noteRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(notes)
      .where(eq(notes.userId, ctx.session.user.id))
      .orderBy(desc(notes.createdAt));
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [note] = await ctx.db
        .select()
        .from(notes)
        .where(and(eq(notes.id, input.id), eq(notes.userId, ctx.session.user.id)))
        .limit(1);

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }
      return note;
    }),

  create: protectedProcedure
    .input(createNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(notes)
        .values({ ...input, userId: ctx.session.user.id })
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(updateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(notes)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(notes.id, id), eq(notes.userId, ctx.session.user.id)))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(notes)
        .where(and(eq(notes.id, input.id), eq(notes.userId, ctx.session.user.id)))
        .returning();

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }
      return { success: true };
    }),
});
