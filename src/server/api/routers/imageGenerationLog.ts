import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { nanoid } from "ai";
import { env } from "@/env.mjs";
import { uploadImagesToBucket } from "@/utils/minio/file-uploader";

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
      const bucketName = env.MINIO_BUCKET_NAME;

      const imagesWithNames = input.generatedImages.map((img) => ({
        image: img,
        name: `${input.imageGenerationRequestId}-${nanoid()}`,
      }));
      console.log(imagesWithNames);
      uploadImagesToBucket(imagesWithNames, bucketName);

      await ctx.prisma.generatedImages.createMany({
        data: input.imagesWithNames.map((generatedImage) => ({
          imageName: generatedImage.name,
          imageBucketName: input.bucketName,
          imageGenerationRequestId: input.imageGenerationRequestId,
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
