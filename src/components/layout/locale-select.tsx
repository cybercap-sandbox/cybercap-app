import { useEffect, useState } from "react";
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
import { Icons } from "../icons";

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
  const defaultLocale = session?.user.interfaceLanguage; // load from the user's preferences

  useEffect(() => {
    const changeLanguage = async () => {
      if (defaultLocale) {
        await i18n.changeLanguage(defaultLocale);
      }
    };

    void changeLanguage();
  }, [defaultLocale, i18n]);

  const onToggleLanguageClick = async (newLocale: string) => {
    setIsLoading(true);
    const { pathname, asPath, query } = router;
    await router.push({ pathname, query }, asPath, { locale: newLocale });
    if (session?.user) {
      await userInterfaceLanguageMutation.mutateAsync({ language: newLocale });
      setIsLoading(false);
      await update({ interfaceLanguage: newLocale });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Icons.spinner className="animate-spin" fill="black" />;
  }
  if (status === "loading") {
    return null;
  }

  return (
    <Select
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onValueChange={onToggleLanguageClick}
      value={i18n.language}
      defaultValue={defaultLocale}
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
