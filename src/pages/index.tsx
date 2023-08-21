import Head from "next/head";
import PlaygroundPage from "@/components/playground/openai-playground";

// import type { InferGetStaticPropsType, GetStaticProps } from "next";
// import OpenAI from "openai";
// import { env } from "@/env.mjs";

// get models from openai and revalidate every 24 hours
// export const getStaticProps: GetStaticProps<{
//   models: string[];
// }> = async () => {
//   const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
//   const list = await openai.models.list();
//   const modelsList = list.data.map((model) => model.id);
//   return {
//     props: {
//       models: modelsList,
//     },
//   };
// };

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-new-red flex min-h-screen  items-center justify-center">
        <PlaygroundPage />
      </main>
    </>
  );
}
