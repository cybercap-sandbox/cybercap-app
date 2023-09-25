"use client";
import * as React from "react";
import { useChat } from "ai/react";
import { type Metadata } from "next";
import { api } from "@/utils/api";
import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/openai-playground/model-selector";
import { useTranslation } from "next-i18next";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};
const defaultModel = "gpt-3.5-turbo";

export default function ChatPlayground() {
  const { t } = useTranslation("chat-playground-component");

  const [currentModel, setCurrentModel] = React.useState<string>(defaultModel);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({ body: { model: currentModel } });

  const modelsList = api.openAiModels.getModels.useQuery({
    availableForChat: true,
  }).data;
  const modelsListString = modelsList?.map((m) => m.name) ?? ([] as string[]);
  const messagesRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
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
          <h2 className="text-lg font-semibold">{t("h2")}</h2>
        </div>
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr]">
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div className="grid h-full grid-rows-[auto_200px_200px] gap-6 lg:grid-cols-[1fr_1fr_200px] lg:grid-rows-1">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Start chatting with the AI..."
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
                      <h3 className="text-base font-semibold">Model</h3>
                      <ModelSelector
                        currentModel={currentModel}
                        setCurrentModel={setCurrentModel}
                        modelsList={modelsListString}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button disabled={isLoading}>
                  {isLoading && <Icons.spinner className="animate-spin" />}
                  Submit (Ctrl+Enter)
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={stop}
                  disabled={!isLoading}
                >
                  Stop
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
