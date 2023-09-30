import {
  AllChatSessionsContext,
  type ChatSessionWithMessages,
} from "@/components/openai-playground/chat-sessions/context/chat-sessions-context";
import { api } from "@/utils/api";
import { nanoid } from "ai";
import { useContext } from "react";

export function useCreateChatSession() {
  const { dispatchChatSessions: dispatchAllSessions } = useContext(
    AllChatSessionsContext
  );
  const createSessionMutation = api.chatSession.createChatSession.useMutation();

  const handleCreateSession = async (name?: string) => {
    const newChatSessionName =
      name ?? `Chat session ${new Date().toLocaleString()}`;
    const tempChatSession = {
      id: nanoid(),
      name: newChatSessionName,
      isActive: true,
    } as ChatSessionWithMessages;
    dispatchAllSessions({
      type: "addChatSessionAndMakeActive",
      payload: tempChatSession,
    });

    const newChatFromDb = await createSessionMutation.mutateAsync({
      name: newChatSessionName,
      id: tempChatSession.id,
    });
    dispatchAllSessions({
      type: "updateChatSession",
      payload: { ...newChatFromDb, isActive: true },
    });
  };

  return { handleCreateSession, createSessionMutation };
}
