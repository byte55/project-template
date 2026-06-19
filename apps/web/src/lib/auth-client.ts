import { createAuthClient } from "better-auth/react";

// Explicit annotation: otherwise better-auth infers a non-portable type
// via the API's node_modules (TS2742).
export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
);
