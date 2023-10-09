import { useTranslation } from "next-i18next";
import Link from "next/link";

export function LoginLink() {
  const { t } = useTranslation("top-panel");
  return (
    <Link
      className="inline-flex h-10 items-center justify-center
   rounded-md bg-secondary px-4 py-2 text-sm font-medium
    text-secondary-foreground 
   transition-all hover:bg-secondary/80 hover:ring-1 hover:ring-primary
   active:scale-90"
      href={"/auth/signin"}
    >
      {t("auth-status.login")}
    </Link>
  );
}
