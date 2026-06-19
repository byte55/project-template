import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test-setup.ts"],
    testTimeout: 15_000,
    hookTimeout: 30_000,
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true }, // serialize — tests share a single DB
    },
  },
  resolve: {
    conditions: ["node"],
  },
});
