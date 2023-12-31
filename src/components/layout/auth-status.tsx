/* eslint-disable @typescript-eslint/no-misused-promises */

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getNameAbbreviation } from "@/utils/name-abbreviation";
import { LoginLink } from "./login-link";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("top-panel");
  const nameAbbreviation = getNameAbbreviation(session?.user?.name ?? "");
  return (
    <>
      <div className="hidden lg:block" data-cy={"userInfoContainer"}>
        {status === "authenticated" && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback data-cy={"nameAbbreviation"}>
                {nameAbbreviation}
              </AvatarFallback>
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
          data-cy={"logoutButton"}
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
        <CircleNotch size={24} className="animate-spin" />
      )}
    </>
  );
}
