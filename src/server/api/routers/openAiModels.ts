import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const openAiModels = createTRPCRouter({
  getModels: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        availableForChat: z.boolean().optional(),
        availableForEmbeddings: z.boolean().optional(),
        availableForAudioTranscript: z.boolean().optional(),
        availableForFineTuningJobs: z.boolean().optional(),
        availableForFineTunes: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // if no input, return all models
      if (!input) {
        return await ctx.prisma.openAIModels.findMany();
      }

      return await ctx.prisma.openAIModels.findMany({
        where: {
          name: input.name,
          availableForChat: input.availableForChat,
          availableForEmbeddings: input.availableForEmbeddings,
          availableForAudioTranscript: input.availableForAudioTranscript,
          availableForFineTuningJobs: input.availableForFineTuningJobs,
          availableForFineTunes: input.availableForFineTunes,
        },
      });
    }),
});
