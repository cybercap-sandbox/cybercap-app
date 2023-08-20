import Head from "next/head";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import PlaygroundPage from "@/components/playground/openai-playground";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import OpenAI from "openai";
import { env } from "@/env.mjs";

//
export const getServerSideProps: GetServerSideProps<{
  models: string[];
}> = async () => {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const list = await openai.models.list();
  const modelsList = list.data.map((model) => model.id);
  return {
    props: {
      models: modelsList,
    },
  };
};

export default function Home({
  models,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-new-red flex min-h-screen  items-center justify-center">
        <PlaygroundPage models={models} />
      </main>
    </>
  );
}
