/* eslint-disable @typescript-eslint/no-misused-promises */
import { Icons } from "@/components/icons";
import { ChatSessionItem } from "./chat-session-item";
import { CreateChatSessionButton } from "./create-session-button";
import { useContext } from "react";
import { AllChatSessionsContext } from "./context/chat-sessions-context";

export function ChatSessionBar() {
  const { allChatSessions, isLoadingFromServer } = useContext(
    AllChatSessionsContext
  );

  const sessionList = allChatSessions.map((chatSession) => (
    <div
      key={chatSession.id}
      className="flex w-full flex-col gap-2 overflow-auto"
    >
      <ChatSessionItem chatSession={chatSession} />
    </div>
  ));

  return (
    <>
      {!isLoadingFromServer && <CreateChatSessionButton />}
      <div className="h-full w-full overflow-auto">
        {isLoadingFromServer && (
          <div className="flex items-center justify-center">
            <Icons.spinner className="animate-spin" fill="black" />
          </div>
        )}
        {sessionList}
      </div>
    </>
  );
}
