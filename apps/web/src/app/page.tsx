"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";

// Example dashboard: lists notes, creates new ones, deletes them. Demonstrates
// the tRPC query/mutation pattern including cache invalidation.
export default function HomePage() {
  const utils = trpc.useUtils();
  const { data: notes, isLoading } = trpc.note.list.useQuery();
  const [title, setTitle] = useState("");

  const create = trpc.note.create.useMutation({
    onSuccess: () => {
      setTitle("");
      utils.note.list.invalidate();
    },
  });
  const remove = trpc.note.delete.useMutation({
    onSuccess: () => utils.note.list.invalidate(),
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <button
          onClick={() => authClient.signOut()}
          className="text-sm text-muted-foreground hover:underline"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) create.mutate({ title, body: "" });
        }}
        className="mb-6 flex gap-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New note…"
          className="flex-1 rounded-md border border-border px-3 py-2"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : notes && notes.length > 0 ? (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between rounded-md border border-border px-4 py-3"
            >
              <span>{note.title}</span>
              <button
                onClick={() => remove.mutate({ id: note.id })}
                className="text-sm text-destructive hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No notes yet.</p>
      )}
    </main>
  );
}
