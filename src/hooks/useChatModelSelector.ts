import { api } from "@/utils/api";
import { useState } from "react";

const defaultModel = "gpt-3.5-turbo";

export function useChatModelSelector() {
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const modelsList = api.openAiModels.getModels.useQuery({
    availableForChat: true,
  }).data;

  const modelsListString = modelsList?.map((m) => m.name) ?? ([] as string[]);

  return {
    currentModel,
    setCurrentModel,
    modelsList,
    modelsListString,
  };
}
