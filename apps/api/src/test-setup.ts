// Vitest setup for API integration tests.
// Ensures the tests run against the test database, not the dev database.
import { beforeAll } from "vitest";

beforeAll(() => {
  if (!process.env.TEST_DATABASE_URL) {
    throw new Error(
      "TEST_DATABASE_URL is not set — tests must run against the test DB.",
    );
  }
});
