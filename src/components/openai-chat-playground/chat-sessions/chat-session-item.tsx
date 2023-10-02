import { cn } from "@/utils/class-merge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { api } from "@/utils/api";
import { useContext, useState } from "react";
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

  const handleEditSession = async (id: string) => {
    setIsEditing(false);
    if (!newName) return;
    await renameChatSession(newName, id);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleEditSession(chatSession.id);
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
      />
      <span
        className="h-max rounded-none px-2 py-3 hover:bg-gray-200"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => handleEditSession(chatSession.id)}
      >
        <Icons.ok className="h-4 w-4" />
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
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setNewName(chatSession.name!);
                  }}
                >
                  <Icons.pen className="h-4 w-4" />
                </span>

                <span
                  className="h-max rounded-sm px-2 py-2 hover:bg-gray-200"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => handleDeleteSession(chatSession.id)}
                >
                  <Icons.trash className="h-4 w-4" />
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
