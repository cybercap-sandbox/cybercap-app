/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { type Message as OpenAIMessage } from "ai";

import { useTranslation } from "next-i18next";
import { Separator } from "@/components//ui/separator";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/openai-chat-playground/model-selector";
import { ChatSessionBar } from "@/components/openai-chat-playground/chat-sessions/chat-sessions-bar";
import {
  AllChatSessionsContext,
  ChatSessionWithMessages,
} from "@/components/openai-chat-playground/chat-sessions/context/chat-sessions-context";
import { ChatPlaygroundWrapper } from "@/components/openai-chat-playground/chat-playground-wrapper";
import { useChatModelSelector } from "@/hooks/useChatModelSelector";
import { useChatMessage } from "@/hooks/useChatMessage";
import { useChatSession } from "@/hooks/useChatSession";
import { MessagesContainer } from "./messages-container";

export default function ChatPlayground() {
  const { t } = useTranslation("chat-playground");
  const { allChatSessions, dispatchChatSessions } = useContext(
    AllChatSessionsContext
  );

  const [activeSession, setActiveSession] = useState<
    ChatSessionWithMessages | undefined
  >();

  const { saveChatMessageInDb } = useChatMessage({ activeSession });

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
      await saveChatMessageInDb(message);
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

  // Set messages from active session to openAI messages only when the active session changes
  useEffect(() => {
    let activeSessionInContext;
    if (allChatSessions.length > 0) {
      activeSessionInContext = allChatSessions.find((s) => s.isActive);
    }
    if (!activeSessionInContext || !activeSessionInContext?.messages)
      setMessages([]);
    // set messages from active session to openAI messages user switch session
    if (
      activeSessionInContext?.messages &&
      activeSessionInContext.id !== activeSession?.id
    ) {
      setMessages(activeSessionInContext.messages);
    }
    setActiveSession(activeSessionInContext);
  }, [allChatSessions, dispatchChatSessions, setMessages, activeSession?.id]);

  const { handleCreateSession, renameChatSession } = useChatSession();
  const handleSubmitMessageFromUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // prevent empty messages
    if (!input) return;
    // Create a new session if there is no active session
    console.log(activeSession);

    if (!activeSession) {
      await handleCreateSession();
    }
    console.log(activeSession);
    if (!activeSession?.id) return;

    handleSubmit(e);
    // Save message from user to db

    console.log(input);
    // Rename session if it's the first message
    if (activeSession.messages && activeSession.messages.length === 0) {
      await renameChatSession(input, activeSession.id);
    }

    // add message to context
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

    await saveChatMessageInDb({
      content: input,
      role: "user",
    } as OpenAIMessage);
  };

  // Handle ctrl+enter to submit
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      await handleSubmitMessageFromUser(
        e as unknown as React.FormEvent<HTMLFormElement>
      );
    }
  };

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

        <MessagesContainer messages={messages} />
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
