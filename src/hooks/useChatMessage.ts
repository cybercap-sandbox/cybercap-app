import { type ChatSessionWithMessages } from "@/components/openai-chat-playground/chat-sessions/context/chat-sessions-context";
import { api } from "@/utils/api";
import { type Message as OpenAIMessage } from "ai";

export function useChatMessage({
  activeSession,
}: {
  activeSession: ChatSessionWithMessages | undefined;
}) {
  const saveMessageInDbMutation = api.chatSession.saveMessage.useMutation();
  const saveMessageIsLoading = saveMessageInDbMutation.isLoading;
  const saveChatMessageInDb = async (message: OpenAIMessage) => {
    if (!activeSession?.id) return;
    if (!message.content) return;
    await saveMessageInDbMutation.mutateAsync({
      chatSessionId: activeSession.id,
      message: message.content,
      role: message.role,
    });
  };

  return { saveChatMessageInDb, saveMessageIsLoading };
}
