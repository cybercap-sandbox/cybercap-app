/* eslint-disable @typescript-eslint/no-misused-promises */
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

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
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background  transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          href={"/auth/signin"}
        >
          {t("auth-status.login")}
        </Link>
      )}
      {status === "loading" && (
        <Icons.spinner className="animate-spin" fill="black" />
      )}
    </>
  );
}
