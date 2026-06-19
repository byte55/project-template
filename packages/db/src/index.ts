import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, session, account, verification } from "./schema/auth";
import { notes } from "./schema/note";

// Register all schemas here so Drizzle knows about relations/queries.
const allSchema = {
  user,
  session,
  account,
  verification,
  notes,
};

/** Creates a Drizzle instance for a given connection URL (e.g. test DB). */
export function createDb(url: string) {
  return drizzle(postgres(url), { schema: allSchema });
}

/**
 * Typed Drizzle instance — use instead of `db: any` in services/routers.
 * `Database` accepts both the root instance and an active transaction, so
 * helpers remain usable inside `db.transaction()`.
 */
type DrizzleDb = ReturnType<typeof createDb>;
export type Transaction = Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
export type Database = DrizzleDb | Transaction;

// Default instance from DATABASE_URL (app runtime).
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema: allSchema });

export { user, session, account, verification, notes };
