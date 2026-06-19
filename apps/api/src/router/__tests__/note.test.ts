import { describe, it, expect, beforeEach } from "vitest";
import { sql } from "drizzle-orm";
import { notes } from "@app/db";
import { testDb, createTestUser, createTestCaller } from "../../test-utils.js";

describe("note router", () => {
  beforeEach(async () => {
    await testDb.delete(notes);
  });

  it("creates and lists a note for the owner", async () => {
    const userId = await createTestUser();
    const caller = createTestCaller(userId);

    const created = await caller.note.create({ title: "Hallo", body: "Welt" });
    expect(created.title).toBe("Hallo");

    const list = await caller.note.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(created.id);
  });

  it("does not leak notes across users", async () => {
    const alice = await createTestUser();
    const bob = await createTestUser();

    await createTestCaller(alice).note.create({
      title: "Alice's note",
      body: "",
    });

    const bobsList = await createTestCaller(bob).note.list();
    expect(bobsList).toHaveLength(0);
  });

  it("rejects byId for a note owned by someone else", async () => {
    const alice = await createTestUser();
    const bob = await createTestUser();

    const note = await createTestCaller(alice).note.create({
      title: "Privat",
      body: "",
    });

    await expect(
      createTestCaller(bob).note.byId({ id: note.id }),
    ).rejects.toThrow(/not found/);
  });

  it("keeps the database reachable", async () => {
    const [{ ok }] = await testDb.execute<{ ok: number }>(sql`SELECT 1 as ok`);
    expect(ok).toBe(1);
  });
});
