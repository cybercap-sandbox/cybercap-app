import { type ChatSessionWithMessages } from "@/components/openai-playground/chat-sessions/context/chat-sessions-context";
import { api } from "@/utils/api";
import { type Message as OpenAIMessage } from "ai";

export function useSaveChatMessage({
  activeSession,
}: {
  activeSession: ChatSessionWithMessages | undefined;
}) {
  const saveMessageInDbMutation = api.chatSession.saveMessage.useMutation();

  const saveOpenAiMessage = async (message: OpenAIMessage) => {
    if (!activeSession?.id) return;
    console.log(message);
    await saveMessageInDbMutation.mutateAsync({
      chatSessionId: activeSession.id,
      message: message.content,
      role: message.role,
    });
  };

  return { saveOpenAiMessage };
}
