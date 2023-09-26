import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { roboto_font } from "@/components/layout/logo";
import { Layout } from "@/components/layout";
import { Icons } from "@/components/icons";

export default function Home(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data: session, status } = useSession();
  const { t } = useTranslation("main-page");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container items-center justify-center">
          <h1 className="py-5 text-center text-4xl font-bold">
            {t("h1")}
            <span className={roboto_font.className}>CyberCap</span>
          </h1>
          <p>{t("playground-description")}</p>
          {status === "loading" && (
            <Icons.spinner className="h-5 w-5 animate-spin" />
          )}
          {status === "authenticated" && (
            <>
              <p>
                {t("p-welcome-name")} {session?.user?.name}!
              </p>
              <p>
                {t("p-welcome-email")} {session?.user?.email}.
              </p>
            </>
          )}
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
      ["main-page", "top-panel"],
      null,
      ["en", "fr"]
    )),
  },
});
