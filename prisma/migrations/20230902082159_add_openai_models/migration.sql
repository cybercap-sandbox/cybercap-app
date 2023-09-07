-- CreateTable
CREATE TABLE "OpenAIModels" (
    "name" TEXT NOT NULL,
    "availableForChat" BOOLEAN NOT NULL,
    "availableForImageGeneration" BOOLEAN NOT NULL,
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

-- AddForeignKey
ALTER TABLE "OpenAIModels" ADD CONSTRAINT "OpenAIModels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
