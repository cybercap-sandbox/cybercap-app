import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env.mjs";
import {
  getPresignedUrlForFile,
  saveFileInBucket,
} from "@/utils/s3-files-management";
const bucketName = env.S3_BUCKET_NAME;

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

  downloadGeneratedImageFromBucket: publicProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch(input.fileUrl);
      // return a new response but use 'content-disposition' to suggest saving the file to the user's computer
      return new Response(response.body, {
        headers: {
          ...response.headers, // copy the previous headers
          "content-disposition": `attachment; filename="${input.fileName}"`,
        },
      });
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
          imageName: true,
        },
        take: input.numberOfImages,
        skip: input.skip,
      });
    }),
});
