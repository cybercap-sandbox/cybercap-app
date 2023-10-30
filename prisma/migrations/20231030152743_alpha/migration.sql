/*
  Warnings:

  - You are about to drop the column `availableForImageGeneration` on the `OpenAIModels` table. All the data in the column will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'assistant', 'system', 'function');

-- DropForeignKey
ALTER TABLE "OpenAIModels" DROP CONSTRAINT "OpenAIModels_userId_fkey";

-- AlterTable
ALTER TABLE "OpenAIModels" DROP COLUMN "availableForImageGeneration";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "interfaceLanguage" TEXT;

-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "ImageGenerationRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestText" TEXT NOT NULL,
    "numberOfImages" INTEGER NOT NULL,
    "userId" TEXT,
    "imageSize" TEXT,

    CONSTRAINT "ImageGenerationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedImages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL,
    "imageGenerationRequestId" TEXT,

    CONSTRAINT "GeneratedImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "modelName" TEXT,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageGenerationRequest" ADD CONSTRAINT "ImageGenerationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedImages" ADD CONSTRAINT "GeneratedImages_imageGenerationRequestId_fkey" FOREIGN KEY ("imageGenerationRequestId") REFERENCES "ImageGenerationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_modelName_fkey" FOREIGN KEY ("modelName") REFERENCES "OpenAIModels"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
