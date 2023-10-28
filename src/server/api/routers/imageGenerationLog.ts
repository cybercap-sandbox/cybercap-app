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
        userRequestId: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userRequestId } = input;
      await ctx.prisma.generatedImages.create({
        data: {
          imageUrl: input.imageUrl,
          imageGenerationRequestId: userRequestId,
        },
      });
    }),

  getImagesGeneratedByUser: protectedProcedure
    .input(
      z.object({
        numberOfImages: z.number().default(10),
        skip: z.number().default(0),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.generatedImages.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ImageGenerationRequest: {
            userId: ctx.session?.user.id,
          },
        },
        select: {
          imageUrl: true,
        },
        take: input.numberOfImages,
        skip: input.skip,
      });
    }),
});
