import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const openAiRouter = createTRPCRouter({
  getOpenAiModels: publicProcedure.query(async () => {
    const list = await openai.models.list();
    return list.data.map((model) => model.id);
  }),

  generateImage: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        numberOfImages: z.number(),
        size: z.enum(["256x256", "512x512", "1024x1024"]),
      })
    )
    .mutation(async ({ input }) => {
      let response;
      try {
        response;
        const obj = await openai.images.generate({
          prompt: input.prompt,
          n: input.numberOfImages,
          size: input.size,
        });
        response = obj.data;
      } catch (error) {
        console.error(error);
        response = [] as OpenAI.Images.Image[];
      }

      return response;
    }),
});
