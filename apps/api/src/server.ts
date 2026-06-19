import fastify from "fastify";
import cors from "@fastify/cors";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { db } from "@app/db";
import { sql } from "drizzle-orm";
import { createContext } from "./context.js";
import { appRouter, type AppRouter } from "./router/index.js";
import { auth } from "./auth.js";

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    ...(process.env.NODE_ENV !== "production" && {
      transport: { target: "pino-pretty", options: { colorize: true } },
    }),
  },
});

await server.register(cors, {
  origin: process.env.WEB_URL ?? "http://localhost:3100",
  credentials: true,
});

// Better-Auth catch-all route (login, signup, session, …)
server.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value)
        headers.append(key, Array.isArray(value) ? value.join(", ") : value);
    });

    const response = await auth.handler(
      new Request(url.toString(), {
        method: request.method,
        headers,
        body:
          request.method !== "GET" ? JSON.stringify(request.body) : undefined,
      }),
    );

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    reply.send(await response.text());
  },
});

// tRPC
await server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      server.log.error({ path, err: error }, `tRPC error on ${path}`);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

// Health check — used by CI and agents to verify the app boots
server.get("/health", async (_request, reply) => {
  try {
    await db.execute(sql`SELECT 1`);
    return { status: "ok" };
  } catch {
    return reply
      .status(503)
      .send({ status: "error", message: "DB unreachable" });
  }
});

const port = Number(process.env.API_PORT ?? 4000);

try {
  await server.listen({ port, host: "0.0.0.0" });
  server.log.info(`API running on http://localhost:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
