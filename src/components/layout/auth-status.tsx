/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Icons } from "@/components/icons";
import Image from "next/image";

export function AuthStatus() {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "authenticated" && (
        <div className="flex items-center gap-2">
          {session?.user?.image && (
            <Image
              alt="user profile image"
              src={session?.user?.image}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span className="whitespace-nowrap text-lg">
            {session?.user?.name}
          </span>

          <Button variant={"outline"} onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      )}
      {status === "unauthenticated" && (
        <Button variant={"outline"} onClick={() => signIn()}>
          Login
        </Button>
      )}
      {status === "loading" && (
        <Icons.spinner className="animate-spin" fill="black" />
      )}
    </>
  );
}
