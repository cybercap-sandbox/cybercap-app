import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  //Text models
  const gpt4 = await prisma.openAIModels.upsert({
    where: {
      name: "gpt-4",
    },
    update: {},
    create: {
      name: "gpt-4",
      availableForChat: true,
      availableForEmbeddings: false,
      availableForAudioTranscript: false,
      availableForFineTuningJobs: false,
      availableForFineTunes: false,
      description:
        "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration 2 weeks after it is released.",
      maxTokens: 8192,
      TrainingDataDate: new Date("2021-09-01"),
    },
  });
  const gpt40613 = await prisma.openAIModels.upsert({
    where: {
      name: "gpt-4-0613",
    },
    update: {},
    create: {
      name: "gpt-4-0613",
      availableForChat: true,
      availableForEmbeddings: false,
      availableForAudioTranscript: false,
      availableForFineTuningJobs: false,
      availableForFineTunes: false,
      description:
        "Snapshot of gpt-4 from June 13th 2023 with function calling data. Unlike gpt-4, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
      maxTokens: 8192,
      TrainingDataDate: new Date("2021-09-01"),
    },
  });
  const gpt35turbo = await prisma.openAIModels.upsert({
    where: {
      name: "gpt-3.5-turbo",
    },
    update: {},
    create: {
      name: "gpt-3.5-turbo",
      availableForChat: true,
      availableForEmbeddings: false,
      availableForAudioTranscript: false,
      availableForFineTuningJobs: true,
      availableForFineTunes: false,
      description:
        "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration 2 weeks after it is released.",
      maxTokens: 4097,
      TrainingDataDate: new Date("2021-09-01"),
    },
  });
  const gpt35turbo16k = await prisma.openAIModels.upsert({
    where: {
      name: "gpt-3.5-turbo-16k",
    },
    update: {},
    create: {
      name: "gpt-3.5-turbo-16k",
      availableForChat: true,
      availableForEmbeddings: false,
      availableForAudioTranscript: false,
      availableForFineTuningJobs: false,
      availableForFineTunes: false,
      description:
        "Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.",
      maxTokens: 16384,
      TrainingDataDate: new Date("2021-09-01"),
    },
  });
  const gpt35turbo0613 = await prisma.openAIModels.upsert({
    where: {
      name: "gpt-3.5-turbo-0613",
    },
    update: {},
    create: {
      name: "gpt-3.5-turbo-0613",
      availableForChat: true,
      availableForEmbeddings: false,
      availableForAudioTranscript: false,
      availableForFineTuningJobs: false,
      availableForFineTunes: false,
      description:
        "Snapshot of gpt-3.5-turbo from June 13th 2023 with function calling data. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
      maxTokens: 4097,
      TrainingDataDate: new Date("2021-09-01"),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
