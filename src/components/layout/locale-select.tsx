import { useCallback, useEffect, useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const locales = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fr",
    label: "French",
  },
];

export function LocaleSelect() {
  const { i18n } = useTranslation("top-panel");
  const { data: session, update, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userInterfaceLanguageMutation =
    api.user.setInterfaceLanguage.useMutation();
  // load from the user's preferences

  const updateLocale = useCallback(
    async (newLocale: string) => {
      if (router.locale === newLocale) {
        return;
      }
      const { pathname, asPath, query } = router;
      await router.push({ pathname, query }, asPath, { locale: newLocale });
    },
    [router]
  );

  useEffect(() => {
    const defaultLocale = session?.user.interfaceLanguage;
    const changeLanguage = async () => {
      if (defaultLocale) {
        await updateLocale(defaultLocale);
      }
    };
    void changeLanguage();
  }, [session, updateLocale]);

  const onToggleLanguageClick = async (newLocale: string) => {
    setIsLoading(true);
    // update the locale in the router
    await updateLocale(newLocale);
    if (session?.user) {
      // save language preference to the user's preferences
      await userInterfaceLanguageMutation.mutateAsync({ language: newLocale });
      setIsLoading(false);
      // update user session
      await update();
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <CircleNotch size={24} className="animate-spin" />;
  }
  if (status === "loading") {
    return null;
  }

  return (
    <Select
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onValueChange={onToggleLanguageClick}
      value={i18n.language}
    >
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Locale" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale.value} value={locale.value}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
