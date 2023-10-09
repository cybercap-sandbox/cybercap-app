/* eslint-disable @typescript-eslint/no-misused-promises */
import { CircleNotch } from "@phosphor-icons/react";
import { ChatSessionItem } from "./chat-session-item";
import { CreateChatSessionButton } from "./create-session-button";
import { useContext } from "react";
import { AllChatSessionsContext } from "./context/chat-sessions-context";

export function ChatSessionBar({ stop }: { stop: () => void }) {
  const { allChatSessions, isLoadingFromServer } = useContext(
    AllChatSessionsContext
  );
  const sessionList = allChatSessions.map((chatSession) => (
    <div key={chatSession.id} className=" w-full  overflow-auto">
      <ChatSessionItem chatSession={chatSession} stop={stop} />
    </div>
  ));

  return (
    <div className=" flex max-h-[200px] flex-col gap-4 lg:max-h-[45vh] ">
      {!isLoadingFromServer && <CreateChatSessionButton />}
      {isLoadingFromServer && (
        <div className="flex items-center justify-center">
          <CircleNotch size={24} className="animate-spin" />
        </div>
      )}
      <div className="h-full w-full overflow-auto">
        <div className="flex flex-col gap-1 overflow-auto">{sessionList}</div>
      </div>
    </div>
  );
}
