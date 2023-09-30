"use client";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { useTranslation } from "next-i18next";
import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";
import { Separator } from "@/components//ui/separator";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/openai-playground/model-selector";
import { useChatModelSelector } from "@/hooks/useChatModelSelector";
import { ChatSessionBar } from "@/components/openai-playground/chat-sessions/chat-sessions-bar";

export default function ChatPlayground() {
  const { t } = useTranslation("chat-playground");
  const { currentModel, setCurrentModel, modelsList, modelsListString } =
    useChatModelSelector();
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({ body: { model: currentModel } });

  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesRef.current) return;
    // Scroll to the bottom of the messages div
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // Handle ctrl+enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <>
      <div className=" h-full w-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">
            {t("chat-playground-title")}
          </h2>
        </div>
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr]">
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
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
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="flex flex-col gap-5 rounded-lg border-2 px-1 py-3"
                    >
                      {formatChatMembers(m.role)} {formatChatMessage(m.content)}
                    </div>
                  ))}
                </div>

                <div className="row-start-1 row-end-2 flex flex-col gap-3 lg:row-start-auto lg:row-end-auto">
                  {modelsList && (
                    <>
                      <h3 className="text-base font-semibold">
                        {t("model-selector-title")}
                      </h3>
                      <ModelSelector
                        currentModel={currentModel}
                        setCurrentModel={setCurrentModel}
                        modelsList={modelsListString}
                      />
                      <Separator />
                      <ChatSessionBar />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button disabled={isLoading}>
                  {isLoading && <Icons.spinner className="animate-spin" />}
                  {t("submit-button")}
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={stop}
                  disabled={!isLoading}
                >
                  {t("stop-button")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
