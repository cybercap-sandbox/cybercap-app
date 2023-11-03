-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'assistant', 'system', 'function');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "expires_in" INTEGER,
    "ext_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "interfaceLanguage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "OpenAIModels" (
    "name" TEXT NOT NULL,
    "availableForChat" BOOLEAN NOT NULL,
    "availableForEmbeddings" BOOLEAN NOT NULL,
    "availableForAudioTranscript" BOOLEAN NOT NULL,
    "availableForFineTuningJobs" BOOLEAN NOT NULL,
    "availableForFineTunes" BOOLEAN NOT NULL,
    "description" TEXT,
    "maxTokens" INTEGER,
    "TrainingDataDate" TIMESTAMP(3),
    "deprecated" BOOLEAN,
    "userId" TEXT,

    CONSTRAINT "OpenAIModels_pkey" PRIMARY KEY ("name")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- PopulateTable
-- For gpt-4
INSERT INTO "OpenAIModels" ("name", "availableForChat", "availableForEmbeddings", "availableForAudioTranscript", "availableForFineTuningJobs", "availableForFineTunes", "description", "maxTokens", "TrainingDataDate")
VALUES ('gpt-4', true, false, false, false, false, 'More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration 2 weeks after it is released.', 8192, '2021-09-01');

-- For gpt-4-0613
INSERT INTO "OpenAIModels" ("name", "availableForChat", "availableForEmbeddings", "availableForAudioTranscript", "availableForFineTuningJobs", "availableForFineTunes", "description", "maxTokens", "TrainingDataDate")
VALUES ('gpt-4-0613', true, false, false, false, false, 'Snapshot of gpt-4 from June 13th 2023 with function calling data. Unlike gpt-4, this model will not receive updates, and will be deprecated 3 months after a new version is released.', 8192, '2021-09-01');

-- For gpt-3.5-turbo
INSERT INTO "OpenAIModels" ("name", "availableForChat", "availableForEmbeddings", "availableForAudioTranscript", "availableForFineTuningJobs", "availableForFineTunes", "description", "maxTokens", "TrainingDataDate")
VALUES ('gpt-3.5-turbo', true, false, false, true, false, 'Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration 2 weeks after it is released.', 4097, '2021-09-01');

-- For gpt-3.5-turbo-16k
INSERT INTO "OpenAIModels" ("name", "availableForChat", "availableForEmbeddings", "availableForAudioTranscript", "availableForFineTuningJobs", "availableForFineTunes", "description", "maxTokens", "TrainingDataDate")
VALUES ('gpt-3.5-turbo-16k', true, false, false, false, false, 'Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.', 16384, '2021-09-01');

-- For gpt-3.5-turbo-0613
INSERT INTO "OpenAIModels" ("name", "availableForChat", "availableForEmbeddings", "availableForAudioTranscript", "availableForFineTuningJobs", "availableForFineTunes", "description", "maxTokens", "TrainingDataDate")
VALUES ('gpt-3.5-turbo-0613', true, false, false, false, false, 'Snapshot of gpt-3.5-turbo from June 13th 2023 with function calling data. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.', 4097, '2021-09-01');
