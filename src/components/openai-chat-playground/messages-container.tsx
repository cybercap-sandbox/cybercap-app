import { useEffect, useRef } from "react";
import { type Message as OpenAIMessage } from "ai";
import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";

export function MessagesContainer({ messages }: { messages: OpenAIMessage[] }) {
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
    <div
      className="flex max-h-[500px] flex-col gap-5 overflow-auto rounded-md border bg-muted p-3"
      ref={messagesRef}
    >
      {formattedMessages}
    </div>
  );
}
