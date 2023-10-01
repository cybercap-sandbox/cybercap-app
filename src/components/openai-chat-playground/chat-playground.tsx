/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { useContext, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { type Message as OpenAIMessage } from "ai";

import { useTranslation } from "next-i18next";
import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";
import { Separator } from "@/components//ui/separator";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/openai-chat-playground/model-selector";
import { ChatSessionBar } from "@/components/openai-chat-playground/chat-sessions/chat-sessions-bar";
import { AllChatSessionsContext } from "@/components/openai-chat-playground/chat-sessions/context/chat-sessions-context";
import { ChatPlaygroundWrapper } from "@/components/openai-chat-playground/chat-playground-wrapper";
import { useChatModelSelector } from "@/hooks/useChatModelSelector";
import { useSaveChatMessage } from "@/hooks/useSaveMessage";
import { useCreateChatSession } from "@/hooks/useCreateChatSession";

export default function ChatPlayground() {
  const { t } = useTranslation("chat-playground");
  const { allChatSessions, dispatchChatSessions } = useContext(
    AllChatSessionsContext
  );
  const activeSession = allChatSessions.find((s) => s.isActive);
  const { saveOpenAiMessage } = useSaveChatMessage({ activeSession });

  const { currentModel, setCurrentModel, modelsList, modelsListString } =
    useChatModelSelector();
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    initialMessages: activeSession?.messages ?? [],
    body: { model: currentModel },
    onFinish: async (message) => {
      await saveOpenAiMessage(message);
      if (activeSession)
        dispatchChatSessions({
          type: "addMessageToSession",
          payload: {
            message,
            sessionId: activeSession.id,
          },
        });
    },
  });
  const { handleCreateSession } = useCreateChatSession();

  // Set messages from active session to openAI messages
  useEffect(() => {
    console.log(activeSession);

    if (!activeSession) setMessages([]);
    if (activeSession?.messages) setMessages(activeSession.messages);
  }, [activeSession, setMessages]);

  const handleSubmitMessageFromUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // prevent empty messages
    if (!input) return;
    // Create a new session if there is no active session
    if (!activeSession) {
      await handleCreateSession();
    }
    if (!activeSession?.id) return;

    handleSubmit(e);
    // Save message from user to db
    console.log(input);
    await saveOpenAiMessage({
      content: input,
      role: "user",
    } as OpenAIMessage);
    dispatchChatSessions({
      type: "addMessageToSession",
      payload: {
        message: {
          content: input,
          role: "user",
        } as OpenAIMessage,
        sessionId: activeSession.id,
      },
    });
  };

  // Handle ctrl+enter to submit
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      await handleSubmitMessageFromUser(
        e as unknown as React.FormEvent<HTMLFormElement>
      );
    }
  };

  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesRef.current) return;
    // Scroll to the bottom of the messages div
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const formattedMessages = messages.map((m) => (
    <div
      key={m.id}
      className="flex flex-col gap-5 rounded-lg border-2 px-1 py-3"
    >
      {formatChatMembers(m.role)} {formatChatMessage(m.content)}
    </div>
  ));

  return (
    <ChatPlaygroundWrapper
      handleSubmitMessageFromUser={handleSubmitMessageFromUser}
      isLoading={isLoading}
      stop={stop}
    >
      <div className="grid h-full grid-rows-[auto_200px_200px] gap-6 lg:grid-cols-[1fr_1fr_200px] lg:grid-rows-1">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={t("message-placeholder")}
          className="h-full min-h-[200px] text-lg lg:min-h-[500px]"
          onKeyDown={handleKeyDown}
        />
        <div
          className="flex max-h-[500px] flex-col gap-5 overflow-auto rounded-md border bg-muted p-3"
          ref={messagesRef}
        >
          {formattedMessages}
        </div>
        <div className="row-start-1 row-end-2 flex flex-col gap-3 lg:row-start-auto lg:row-end-auto">
          {modelsList && (
            <ModelSelector
              currentModel={currentModel}
              setCurrentModel={setCurrentModel}
              modelsList={modelsListString}
            />
          )}
          <Separator />
          <ChatSessionBar />
        </div>
      </div>
    </ChatPlaygroundWrapper>
  );
}
