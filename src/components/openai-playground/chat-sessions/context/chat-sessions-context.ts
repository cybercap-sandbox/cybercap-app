import { createContext } from "react";
import type { ChatMessage, ChatSession } from "@prisma/client";
import { setFirstSessionActive } from "./chat-sessions-reducer-functions";
import { type Message } from "ai";

export function chatSessionsReducer(
  allChatSessions: ChatSessionWithMessages[],
  action: ALL_CHAT_SESSIONS_ACTION_TYPE
) {
  switch (action.type) {
    case "loadAllChatSessions":
      return action.payload.map((session, index) => {
        if (index === 0) {
          return {
            ...session,
            isActive: true,
          };
        }
        return {
          ...session,
          isActive: false,
        };
      });
    case "addChatSessionAndMakeActive":
      return [
        {
          ...action.payload,
          isActive: true,
        },
        ...allChatSessions.map((session) => {
          // make all sessions inactive
          return {
            ...session,
            isActive: false,
          };
        }),
      ];

    case "deleteChatSession": {
      const newSessions = allChatSessions.filter(
        (session) => session.id !== action.payload.id
      );

      return newSessions;
    }
    case "updateChatSession": {
      console.log("updateChatSession");
      const newSessions = allChatSessions.map((session) => {
        if (session.id === action.payload.id) {
          return action.payload;
        }
        return session;
      });
      return newSessions;
    }
    case "addMessageToSession": {
      const newSessions = allChatSessions.map((session) => {
        if (session.id === action.payload.sessionId) {
          return {
            ...session,
            messages: [...session.messages, action.payload.message],
          };
        }
        return session;
      });
      return newSessions;
    }
    case "setActiveChatSession": {
      const newSessions = allChatSessions.map((session) => {
        if (session.id === action.payload.id) {
          return {
            ...session,
            isActive: true,
          };
        }
        return {
          ...session,
          isActive: false,
        };
      });
      return newSessions;
    }
    case "setFirstSessionActive": {
      return setFirstSessionActive({
        allSessions: allChatSessions,
      });
    }
  }
}

type AllChatSessionsContextType = {
  allChatSessions: ChatSessionWithMessages[];
  dispatchChatSessions: React.Dispatch<ALL_CHAT_SESSIONS_ACTION_TYPE>;
  isLoadingFromServer: boolean;
};

export const AllChatSessionsContext = createContext<AllChatSessionsContextType>(
  {
    allChatSessions: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatchChatSessions: () => {},
    isLoadingFromServer: false,
  }
);

type ALL_CHAT_SESSIONS_ACTION_TYPE =
  | {
      type: "loadAllChatSessions";
      payload: ChatSessionWithMessages[];
    }
  | {
      type: "addChatSessionAndMakeActive";
      payload: ChatSessionWithMessages;
    }
  | {
      type: "deleteChatSession";
      payload: ChatSessionWithMessages;
    }
  | {
      type: "updateChatSession";
      payload: ChatSessionWithMessages;
    }
  | {
      type: "addMessageToSession";
      payload: {
        sessionId: string;
        message: Message;
      };
    }
  | {
      type: "setActiveChatSession";
      payload: {
        id: string;
      };
    }
  | {
      type: "setFirstSessionActive";
    };

export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessage[];
} & {
  isActive?: boolean;
};
