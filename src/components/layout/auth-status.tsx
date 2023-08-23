/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Icons } from "@/components/icons";

export function AuthStatus() {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "authenticated" && (
        <div className="flex items-center gap-2">
          {session?.user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="user profile image"
              src={session?.user?.image}
              className="h-10 w-10 rounded-full"
            />
          )}
          <span className="whitespace-nowrap text-lg">
            {session?.user?.name}
          </span>

          <Button variant={"secondary"} onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      )}
      {status === "unauthenticated" && (
        <Button variant={"secondary"} onClick={() => signIn()}>
          Login
        </Button>
      )}
      {status === "loading" && (
        <Icons.spinner className="animate-spin" fill="black" />
      )}
    </>
  );
}
