import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "@app/db";
import { auth } from "./auth.js";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  // db is injected (not imported directly) so tests can swap in a different
  // instance. Routers/services always use ctx.db.
  return { db, req, res, session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
