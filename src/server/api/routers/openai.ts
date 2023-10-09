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
  // generateCompletion: publicProcedure
  //   .input(
  //     z.object({
  //       model: z.string(),
  //       prompt: z.string(),
  //       max_tokens: z.number().optional(),
  //       temperature: z.number().optional(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     console.log(input);
  //     try {
  //       const response = await openai.chat.completions.create({
  //         model: input.model,
  //         messages: [{ role: "user", content: input.prompt }],
  //         temperature: input.temperature ? input.temperature : 0.9,
  //         max_tokens: input.max_tokens ? input.max_tokens : 150,
  //         stream: true,
  //       });

  //       const stream = OpenAIStream(response);
  //       return new StreamingTextResponse(stream);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }),

  generateImage: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        numberOfImages: z.number(),
        size: z.enum(["256x256", "512x512", "1024x1024"]),
      })
    )
    .mutation(async ({ input }) => {
      const response = await openai.images
        .generate({
          prompt: input.prompt,
          n: input.numberOfImages,
          size: input.size,
        })
        .then((response) => {
          return {
            response: response?.data,
          };
        });
      return response;
    }),
});
