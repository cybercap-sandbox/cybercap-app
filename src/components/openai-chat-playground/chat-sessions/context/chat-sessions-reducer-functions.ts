import { type ChatSessionWithMessages } from "./chat-sessions-context";

export function deleteChatSessionAndMakeFirstActive({
  allSessions,
  action,
}: {
  allSessions: ChatSessionWithMessages[];
  action: {
    type: "deleteChatSession";
    payload: ChatSessionWithMessages;
  };
}) {
  return allSessions.filter((session) => session.id !== action.payload.id);
}

export function setFirstSessionActive({
  allSessions,
}: {
  allSessions: ChatSessionWithMessages[];
}) {
  const newSessions = allSessions.map((session, index) => {
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
  return newSessions;
}

const testSessions = [
  {
    id: "1",
    isActive: false,
  },
  {
    id: "2",
    isActive: false,
  },
  {
    id: "3",
    isActive: true,
  },
  {
    id: "4",
    isActive: false,
  },
];

// console.log(
//   setFirstSessionActive({
//     allSessions: testSessions as ChatSessionWithMessages[],
//   })
// );

// console.log(
//   deleteChatSessionAndMakeFirstActive({
//     allSessions: testSessions as ChatSessionWithMessages[],
//     action: {
//       type: "deleteChatSession",
//       payload: {
//         id: "3",
//         isActive: true,
//       } as ChatSessionWithMessages,
//     },
//   })
// );
