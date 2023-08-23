import Head from "next/head";
import { roboto_font } from "@/components/layout/logo";
import { Layout } from "@/components/layout";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";

export default function Home() {
  const { data: session, status } = useSession();
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
          {status === "loading" && (
            <Icons.spinner className="h-5 w-5 animate-spin" />
          )}
          {status === "authenticated" && (
            <>
              <p>Welcome, {session?.user?.name}!</p>
              <p>Your email is {session?.user?.email}.</p>
            </>
          )}
        </main>
      </Layout>
    </>
  );
}
