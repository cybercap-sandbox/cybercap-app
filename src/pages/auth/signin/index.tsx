import type { Metadata } from "next";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UserAuthForm } from "@/components/authentication/user-auth-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication page",
};

export default function AuthenticationPage(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <div className="container relative flex h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
        <div className="relative hidden h-full flex-col justify-center bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20">
            <Logo variant="white" />
          </div>
        </div>
        <div className="col-span-2 grid h-full grid-rows-[100px_1fr] p-2 lg:block lg:grid-rows-1">
          <div className="block lg:hidden">
            <Logo />
          </div>
          <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6  sm:w-[350px]">
            <h1 className="text-center text-2xl font-semibold ">Sign in</h1>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? defaultLocale ?? "en",
      ["authentication-page"],
      null,
      ["en", "fr"]
    )),
  },
});
