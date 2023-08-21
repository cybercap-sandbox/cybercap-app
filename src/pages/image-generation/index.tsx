import Head from "next/head";
import ChatPlaygroundPage from "@/components/openai-playground/chat-playground";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cybercap | Image generation</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red flex items-center justify-center"></main>
      </Layout>
    </>
  );
}
