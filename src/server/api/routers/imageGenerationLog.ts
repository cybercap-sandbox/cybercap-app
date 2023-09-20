import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const imageGenerationLogRouter = createTRPCRouter({
  saveUserRequest: protectedProcedure
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
