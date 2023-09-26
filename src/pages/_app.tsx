import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { appWithTranslation } from "next-i18next";
import { api } from "@/utils/api";
import nextI18NextConfig from "../../next-i18next.config.js";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

const myAppWithTranslation = appWithTranslation(MyApp, nextI18NextConfig);
export default api.withTRPC(myAppWithTranslation);
