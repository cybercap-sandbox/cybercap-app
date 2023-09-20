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
        imageSize: z.string(),
        numberOfImages: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.imageGenerationRequest.create({
        data: {
          userId: ctx.session?.user.id,
          requestText: input.requestText,
          numberOfImages: input.numberOfImages,
          imageSizeTitle: input.imageSize,
        },
      });
    }),

  saveGeneratedImages: protectedProcedure
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

  getAllImagesGeneratedByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.imageGenerationRequest.findMany({
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
