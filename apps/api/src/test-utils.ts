// Helper for integration tests: builds a tRPC caller with a real test DB and
// a fake session, without going through the HTTP/auth layer.
import { randomUUID } from "node:crypto";
import { createDb, user } from "@app/db";
import { appRouter } from "./router/index.js";
import type { Context } from "./context.js";

export const testDb = createDb(process.env.TEST_DATABASE_URL!);

/** Creates a test user and returns its ID. */
export async function createTestUser(): Promise<string> {
  const id = randomUUID();
  await testDb.insert(user).values({
    id,
    name: "Test User",
    email: `test-${id}@example.com`,
    emailVerified: true,
  });
  return id;
}

// Explicit annotation required: the inferred caller type references an internal
// tRPC module and is otherwise not portable (TS2742).
type TestCaller = ReturnType<typeof appRouter.createCaller>;

/**
 * Creates a tRPC caller authenticated as the given user.
 * Uses the test DB as ctx.db (which is why routers must always use ctx.db).
 */
export function createTestCaller(userId: string): TestCaller {
  const ctx = {
    db: testDb,
    session: {
      user: { id: userId },
      session: { userId },
    },
  } as unknown as Context;

  return appRouter.createCaller(ctx);
}
