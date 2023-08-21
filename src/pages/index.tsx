import Head from "next/head";
import { roboto_font } from "@/components/layout/logo";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cybercap | Home</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container items-center justify-center">
          <h1 className="py-5 text-center text-4xl font-bold">
            Welcome to <span className={roboto_font.className}>CyberCap</span>
          </h1>
          <p>
            The website provides a playground for OpenAI chat and image
            generation models.
          </p>
        </main>
      </Layout>
    </>
  );
}
