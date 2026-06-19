// Example entity. Shows the pattern: own table + ownership reference to user.
// When adding new entities, copy this file as a template and register it in
// src/index.ts (allSchema + re-export).
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notes = pgTable(
  "notes",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull(),
    body: text().notNull().default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("notes_user_id_idx").on(t.userId)],
);
