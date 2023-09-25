/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Icons } from "@/components/icons";
import { useTranslation } from "next-i18next";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("top-panel");

  return (
    <>
      <div className="hidden lg:block">
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
            {session?.user?.name && (
              <span className="whitespace-nowrap text-lg">
                {session?.user?.name}
              </span>
            )}
            {/* If user doesn't provide name use email */}
            {!session?.user?.name && session?.user?.email && (
              <span className="whitespace-nowrap text-lg">
                {session?.user?.email}
              </span>
            )}
          </div>
        )}
      </div>
      {status === "authenticated" && (
        <Button variant={"secondary"} onClick={() => signOut()}>
          {t("auth-status.logout")}
        </Button>
      )}
      {status === "unauthenticated" && (
        <Button variant={"secondary"} onClick={() => signIn()}>
          {t("auth-status.login")}
        </Button>
      )}
      {status === "loading" && (
        <Icons.spinner className="animate-spin" fill="black" />
      )}
    </>
  );
}
