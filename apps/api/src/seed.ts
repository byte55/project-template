// Dev seed: creates a demo user + a few notes.
// Run with: task seed   (or: docker compose exec api npx tsx apps/api/src/seed.ts)
import { db, notes } from "@app/db";
import { eq } from "drizzle-orm";
import { user as userTable } from "@app/db";
import { auth } from "./auth.js";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo1234";

async function seed() {
  // Create the user via better-auth so the password is hashed correctly.
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, DEMO_EMAIL))
    .limit(1);

  if (existing.length === 0) {
    await auth.api.signUpEmail({
      body: { name: "Demo", email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    console.log(`✓ Demo user created: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log(`• Demo user already exists: ${DEMO_EMAIL}`);
  }

  const [demo] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, DEMO_EMAIL))
    .limit(1);

  await db.delete(notes).where(eq(notes.userId, demo.id));
  await db.insert(notes).values([
    { userId: demo.id, title: "Welcome", body: "This is your first note." },
    { userId: demo.id, title: "Second note", body: "Edit or delete me." },
  ]);
  console.log("✓ Demo notes created");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
