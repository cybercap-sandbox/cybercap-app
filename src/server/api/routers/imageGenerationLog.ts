import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env.mjs";
import {
  getFileFromBucket,
  getPresignedUrlForFile,
  saveFileInBucket,
} from "@/utils/minio-management";
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
      const image = await getPresignedUrlForFile({
        bucketName,
        fileName: input.fileName,
      });
      return image;
    }),

  saveGeneratedImages: publicProcedure
    .input(
      z.object({
        userRequestId: z.string(),
        imageNames: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userRequestId } = input;
      await ctx.prisma.generatedImages.createMany({
        data: input.imageNames.map((imageName) => ({
          imageName: imageName,
          imageBucketName: bucketName,
          imageGenerationRequestId: userRequestId,
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
