import {
  AllChatSessionsContext,
  type ChatSessionWithMessages,
} from "@/components/openai-chat-playground/chat-sessions/context/chat-sessions-context";
import { api } from "@/utils/api";
import { nanoid } from "ai";
import { useContext } from "react";

export function useChatSession() {
  const { dispatchChatSessions, allChatSessions } = useContext(
    AllChatSessionsContext
  );
  const createSessionMutation = api.chatSession.createChatSession.useMutation();
  const updateSessionMutation = api.chatSession.updateChatSession.useMutation();

  const handleCreateSession = async (name?: string) => {
    const newChatSessionName =
      name ?? `Chat session ${new Date().toLocaleString()}`;
    // create a temporary chat session in context
    const tempChatSession = {
      id: nanoid(10),
      name: newChatSessionName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "temp",
      messages: [],
    } as ChatSessionWithMessages;
    dispatchChatSessions({
      type: "addChatSessionAndMakeActive",
      payload: tempChatSession,
    });

    // create a chat session in db and update context
    const newChatFromDb = await createSessionMutation.mutateAsync({
      name: newChatSessionName,
      id: tempChatSession.id,
    });
    dispatchChatSessions({
      type: "updateChatSession",
      payload: { ...newChatFromDb, isActive: true },
    });
    return newChatFromDb;
  };

  const renameChatSession = async (
    newChatSessionName: string,
    chatSessionId: string
  ) => {
    const chatSession = allChatSessions.find((s) => s.id === chatSessionId);
    if (!chatSession) return;
    // update chat session in context
    dispatchChatSessions({
      type: "updateChatSession",
      payload: {
        ...chatSession,
        name: newChatSessionName,
      },
    });
    // update chat session in db
    await updateSessionMutation.mutateAsync({
      id: chatSessionId,
      name: newChatSessionName,
    });
  };

  return { handleCreateSession, createSessionMutation, renameChatSession };
}
