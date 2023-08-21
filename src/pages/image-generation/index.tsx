import Head from "next/head";
import { ImageGenerationPromptForm } from "@/components/openai-playground/image-promp-form";
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
        <main className="bg-new-red container flex items-center justify-center">
          <div className="mt-16 grid w-full grid-cols-[300px_1fr]">
            <ImageGenerationPromptForm />
          </div>
        </main>
      </Layout>
    </>
  );
}
