import { useTranslation } from "next-i18next";
import { LoginLink } from "./login-link";

export function LoginRequiredMessage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">{t("login-required-title")}</h1>
      <div className="mt-5 flex items-center justify-center gap-3">
        <p className="text-xl ">{t("login-required-message")}</p>
        <LoginLink />
      </div>
    </div>
  );
}
