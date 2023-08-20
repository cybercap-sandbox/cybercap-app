import { createTRPCRouter } from "@/server/api/trpc";
import { openAiRouter } from "./routers/openai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  openai: openAiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
