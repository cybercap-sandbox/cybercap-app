import { cn } from "@/utils/class-merge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { api } from "@/utils/api";
import { useContext } from "react";
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

export function ChatSessionItem({
  chatSession,
}: {
  chatSession: ChatSessionWithMessages;
}) {
  const deleteSessionMutation = api.chatSession.deleteChatSession.useMutation();

  const { dispatchChatSessions, allChatSessions } = useContext(
    AllChatSessionsContext
  );

  const handleDeleteSession = async (id: string) => {
    if (deleteSessionMutation.isLoading) return;

    console.log(allChatSessions);
    dispatchChatSessions({
      type: "deleteChatSession",
      payload: {
        id,
      } as ChatSessionWithMessages,
    });
    console.log(allChatSessions);

    await deleteSessionMutation.mutateAsync({ id });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "relative flex w-full justify-between rounded-none px-2",
              chatSession.isActive && "bg-gray-200"
            )}
            onClick={() => {
              dispatchChatSessions({
                type: "setActiveChatSession",
                payload: chatSession,
              });
            }}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {chatSession.name}
            </span>

            {chatSession.isActive && (
              <div className="flex items-center justify-center gap-1">
                {deleteSessionMutation.isLoading && (
                  <Icons.spinner
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                    fill="black"
                  />
                )}
                <span
                  className="h-max rounded-sm px-2 py-2 hover:bg-gray-200"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => handleDeleteSession(chatSession.id)}
                >
                  <Icons.trash className="h-4 w-4" />
                </span>
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{chatSession.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
