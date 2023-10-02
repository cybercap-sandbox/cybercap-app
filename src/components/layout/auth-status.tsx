/* eslint-disable @typescript-eslint/no-misused-promises */

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getNameAbbreviation } from "@/utils/name-abbreviation";
import { LoginLink } from "./login-link";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("top-panel");
  const nameAbbreviation = getNameAbbreviation(session?.user?.name ?? "");
  return (
    <>
      <div className="hidden lg:block">
        {status === "authenticated" && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>{nameAbbreviation}</AvatarFallback>
            </Avatar>
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
        <Button
          variant={"secondary"}
          onClick={() => signOut()}
          className=" transition-all hover:bg-secondary/80 hover:ring-1 hover:ring-primary
        active:scale-90"
        >
          {t("auth-status.logout")}
        </Button>
      )}
      {status === "unauthenticated" && <LoginLink />}
      {status === "loading" && (
        <Icons.spinner className="animate-spin" fill="black" />
      )}
    </>
  );
}
