import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ChatPlayground from "@/components/openai-playground/chat-playground";
import { Layout } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function Home(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation("chat-playground-page");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red flex items-center justify-center">
          <ChatPlayground />
        </main>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? defaultLocale ?? "en",
      ["chat-playground-page", "chat-playground-component", "top-panel"],
      null,
      ["en", "fr"]
    )),
  },
});
