import { formatChatMembers, formatChatMessage } from "@/utils/chat-format";
import { type Message } from "ai";
import { nanoid } from "nanoid";
import { useRef, useEffect } from "react";

export function MessagesList({ messages }: { messages: Message[] }) {
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesRef.current) return;
    // Scroll to the bottom of the messages div
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const messagesList = messages.map((m) => (
    <div
      key={nanoid()}
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
      {messagesList}
    </div>
  );
}
