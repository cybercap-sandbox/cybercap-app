"use client";

import * as React from "react";
import { useTranslation } from "next-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/utils/class-merge";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation("authentication-page");
  const [isLoading, setIsLoading] = React.useState({
    google: false,
    microsoft: false,
  });

  function signInWithGoogle() {
    setIsLoading((prev) => ({
      ...prev,
      google: true,
    }));
    void signIn("google", { callbackUrl: "http://localhost:3000/" });
  }

  function signInWithMicrosoft() {
    setIsLoading((prev) => ({
      ...prev,
      microsoft: true,
    }));
    void signIn("azure-ad", { callbackUrl: "http://localhost:3000/" });
  }

  return (
    <div className={cn("grid gap-3", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.google || isLoading.microsoft}
        onClick={signInWithGoogle}
        className="relative"
      >
        {isLoading.google && (
          <div className="absolute left-5 mr-2">
            <CircleNotch size={18} className="animate-spin" />
          </div>
        )}
        <Icons.google className="mr-2 h-4 w-4" />
        {t("sign-in-with-google")}
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading.google || isLoading.microsoft}
        onClick={signInWithMicrosoft}
        className="relative"
      >
        {isLoading.microsoft && (
          <div className="absolute left-5 mr-2">
            <CircleNotch size={18} className="animate-spin" />
          </div>
        )}
        <Icons.microsoft className="mr-2 h-4 w-4" />
        {t("sign-in-with-microsoft")}
      </Button>
    </div>
  );
}
