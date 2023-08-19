import Head from "next/head";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-new-red flex min-h-screen items-center justify-center">
        <Button variant={"default"}> Hello </Button>
      </main>
    </>
  );
}
