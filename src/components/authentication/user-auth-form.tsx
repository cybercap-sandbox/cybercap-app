"use client";

import * as React from "react";

import { cn } from "@/utils/class-merge";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
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
          <div className="absolute left-5">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" fill="black" />
          </div>
        )}
        <Icons.google className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading.google || isLoading.microsoft}
        onClick={signInWithMicrosoft}
        className="relative"
      >
        {isLoading.microsoft && (
          <div className="absolute left-5">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" fill="black" />
          </div>
        )}
        <Icons.microsoft className="mr-2 h-4 w-4" />
        Sign in with Microsoft
      </Button>
    </div>
  );
}
