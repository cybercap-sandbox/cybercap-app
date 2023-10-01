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
  console.log(isLoadingFromServer);

  const sessionList = allChatSessions.map((chatSession) => (
    <div key={chatSession.id} className=" w-full  overflow-auto">
      <ChatSessionItem chatSession={chatSession} />
    </div>
  ));

  return (
    <div className=" flex max-h-[200px] flex-col gap-4 lg:max-h-[45vh] ">
      {!isLoadingFromServer && <CreateChatSessionButton />}
      {isLoadingFromServer && (
        <div className="flex items-center justify-center">
          <Icons.spinner className="animate-spin" fill="black" />
        </div>
      )}
      <div className="h-full w-full overflow-auto">
        <div className="flex flex-col gap-1 overflow-auto">{sessionList}</div>
      </div>
    </div>
  );
}
