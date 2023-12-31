import { cn } from "@/utils/class-merge";
import { Button } from "@/components/ui/button";
import { Trash, Pen, Check } from "@phosphor-icons/react";
import { api } from "@/utils/api";
import { useContext, useRef, useState } from "react";
import {
  AllChatSessionsContext,
  type ChatSessionWithMessages,
} from "./context/chat-sessions-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatSession } from "@/hooks/useChatSession";
import { Input } from "@/components/ui/input";

export function ChatSessionItem({
  stop,
  chatSession,
}: {
  stop: () => void;
  chatSession: ChatSessionWithMessages;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const deleteSessionMutation = api.chatSession.deleteChatSession.useMutation();
  const { dispatchChatSessions } = useContext(AllChatSessionsContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const { renameChatSession } = useChatSession();

  const handleDeleteSession = async (id: string) => {
    if (deleteSessionMutation.isLoading) return;

    dispatchChatSessions({
      type: "deleteChatSession",
      payload: {
        id,
      } as ChatSessionWithMessages,
    });

    await deleteSessionMutation.mutateAsync({ id });
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setNewName(chatSession.name!);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleEditSession = async (id: string) => {
    setIsEditing(false);
    if (!newName) return;
    await renameChatSession(newName, id);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleEditSession(chatSession.id);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const editElement = (
    <div className="flex w-full items-center">
      <Input
        className="m-0 h-fit w-full rounded-none border-none outline-none focus-visible:ring-0"
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onKeyDown={handleKeyDown}
        ref={inputRef}
        data-cy={"renameChatSessionInput"}
      />
      <span
        className="h-max rounded-none px-2 py-3 hover:bg-gray-200"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => handleEditSession(chatSession.id)}
        data-cy={"renameChatSessionSubmitButton"}
      >
        <Check size={16} />
      </span>
    </div>
  );

  return (
    <TooltipChatSession chatSessionName={chatSession.name!}>
      <Button
        type="button"
        variant={"outline"}
        className={cn(
          "relative flex w-full justify-between rounded-none  px-2",
          isEditing && "px-0 py-0",
          chatSession.isActive && "bg-gray-200"
        )}
        onClick={() => {
          stop();
          dispatchChatSessions({
            type: "setActiveChatSession",
            payload: chatSession,
          });
        }}
      >
        {!isEditing && (
          <>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {chatSession.name}
            </span>

            {chatSession.isActive && (
              <div className="flex items-center justify-center gap-1">
                <span
                  className="h-max rounded-sm px-2 py-2 hover:bg-gray-200"
                  data-cy={"renameChatSessionButton"}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleStartEditing}
                >
                  <Pen size={16} />
                </span>

                <span
                  className="h-max rounded-sm px-2 py-2 hover:bg-gray-200"
                  data-cy={"deleteChatSessionButton"}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => handleDeleteSession(chatSession.id)}
                >
                  <Trash size={16} />
                </span>
              </div>
            )}
          </>
        )}
        {isEditing && editElement}
      </Button>
    </TooltipChatSession>
  );
}

function TooltipChatSession({
  chatSessionName,
  children,
}: {
  chatSessionName: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{chatSessionName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
