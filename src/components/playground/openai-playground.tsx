"use client";
import { useChat } from "ai/react";
import { type Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "../icons";
import * as React from "react";
import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

export default function PlaygroundPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat();
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
          <h2 className="text-lg font-semibold">Chat Playground</h2>
        </div>
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr]">
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div className="grid h-full grid-rows-[300px_300px] gap-6 lg:grid-cols-2 lg:grid-rows-1">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Start chatting with the AI..."
                  className="h-full min-h-[300px] text-lg lg:min-h-[600px]"
                  onKeyDown={handleKeyDown}
                />
                <div
                  className="flex max-h-[600px] flex-col gap-5 overflow-auto rounded-md border bg-muted p-3"
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
