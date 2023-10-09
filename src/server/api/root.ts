import { createTRPCRouter } from "@/server/api/trpc";
import { openAiRouter } from "./routers/openai";
import { openAiModels } from "./routers/openAiModels";
import { userRouter } from "./routers/user";
import { imageGenerationLogRouter } from "./routers/imageGenerationLog";
import { chatSessionRouter } from "./routers/chatSessions";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  openai: openAiRouter,
  openAiModels: openAiModels,
  user: userRouter,
  imageGenerationLog: imageGenerationLogRouter,
  chatSession: chatSessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
