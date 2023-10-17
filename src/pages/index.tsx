import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { CircleNotch } from "@phosphor-icons/react";
import { roboto_font } from "@/components/layout/logo";
import { Layout } from "@/components/layout";

export default function Page(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data: session, status } = useSession();
  const { t } = useTranslation("main-page");
  return (
    <>
      <Head>
        <title>{t("page-title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container items-center justify-center">
          <h1
            className="py-5 text-center text-4xl font-bold"
            data-cy={"welcomeHeader"}
          >
            {t("welcome-header")}
            <span className={roboto_font.className}>CyberCap</span>
          </h1>
          <p data-cy={"welcomeText"}>{t("playground-description")}</p>
          {status === "loading" && (
            <CircleNotch size={24} className="mt-3 animate-spin" />
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
