import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { nanoid } from "ai";
import { env } from "@/env.mjs";
import { getFileFromBucket, saveFileInBucket } from "@/utils/minio-management";
const bucketName = env.MINIO_BUCKET_NAME;

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

  saveGeneratedImageIntoBucket: publicProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { fileUrl, fileName } = input;
      console.log(fileUrl, fileName);
      await saveFileInBucket({
        fileUrl,
        bucketName,
        fileName,
      });
    }),

  getGeneratedImageFromBucket: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const image = await getFileFromBucket({
        bucketName,
        fileName: input.fileName,
      });
      return image;
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
      console.log(imagesWithNames[0].image);
      await saveFileInBucket({
        image: imagesWithNames[0].image,
        bucketName,
        fileName: imagesWithNames[0].name,
      });

      // await ctx.prisma.generatedImages.createMany({
      //   data: input.imagesWithNames.map((generatedImage) => ({
      //     imageName: generatedImage.name,
      //     imageBucketName: input.bucketName,
      //     imageGenerationRequestId: input.imageGenerationRequestId,
      //   })),
      // });
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
