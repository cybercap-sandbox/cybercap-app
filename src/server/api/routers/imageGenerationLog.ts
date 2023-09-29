import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const imageGenerationLogRouter = createTRPCRouter({
  saveUserRequest: publicProcedure
    .input(
      z.object({
        requestText: z.string(),
        numberOfImages: z.number(),
        imageSize: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.imageGenerationRequest.create({
        data: {
          userId: ctx.session?.user.id,
          requestText: input.requestText,
          numberOfImages: input.numberOfImages,
          imageSize: input.imageSize,
        },
      });
    }),

  saveGeneratedImages: publicProcedure
    .input(
      z.object({
        imageGenerationRequestId: z.string(),
        generatedImages: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.generatedImages.createMany({
        data: input.generatedImages.map((generatedImage) => ({
          imageGenerationRequestId: input.imageGenerationRequestId,
          imageUrl: generatedImage,
        })),
      });
    }),

  getAllImagesGeneratedByUser: protectedProcedure
    .input(
      z.object({
        numberOfImages: z.number().default(10),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.imageGenerationRequest.findMany({
        take: input.numberOfImages,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          generatedImages: true,
        },
      });
    }),
});
