// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: ALL_CHAT_SESSIONS_ACTION_TYPE contains ChatSessionWithMessages along with
// {
//   sessionId: string;
//   message: Message;
// };
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useReducer, useState, useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";

import ChatPlayground from "@/components/openai-chat-playground/chat-playground";
import { Layout } from "@/components/layout";
import {
  AllChatSessionsContext,
  type ChatSessionWithMessages,
  chatSessionsReducer,
} from "@/components/openai-chat-playground/chat-sessions/context/chat-sessions-context";
import { api } from "@/utils/api";
import { LoginRequiredMessage } from "@/components/layout/login-required-message";

export default function Page(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation("chat-playground");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [allChatSessions, dispatchChatSessions] = useReducer(
    chatSessionsReducer,
    [] as ChatSessionWithMessages[]
  );
  const { data: session, status } = useSession();

  const [isLoadedFromServer, setIsLoadedFromServer] = useState(false);
  // Get all sessions for the current user from the DB
  const chatSessionsFromServer =
    api.chatSession.getAllStreamsWithMessagesForCurrentUser.useQuery(
      undefined,
      {
        enabled: !!session && !isLoadedFromServer,
      }
    );

  // Update the context with the sessions from the DB
  useEffect(() => {
    if (isLoadedFromServer) return;
    if (!chatSessionsFromServer.data) return;
    dispatchChatSessions({
      type: "loadAllChatSessions",
      payload: chatSessionsFromServer.data as ChatSessionWithMessages[],
    });
    setIsLoadedFromServer(true);
  }, [chatSessionsFromServer.data, dispatchChatSessions, isLoadedFromServer]);

  return (
    <AllChatSessionsContext.Provider
      value={{
        allChatSessions,
        dispatchChatSessions,
        isLoadingFromServer: chatSessionsFromServer.isLoading,
      }}
    >
      <Head>
        <title>{t("page-title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red flex items-center justify-center">
          {status === "authenticated" && <ChatPlayground />}
          {status === "unauthenticated" && <LoginRequiredMessage />}
        </main>
      </Layout>
    </AllChatSessionsContext.Provider>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? defaultLocale ?? "en",
      ["chat-playground", "top-panel", "common"],
      null,
      ["en", "fr"]
    )),
  },
});
