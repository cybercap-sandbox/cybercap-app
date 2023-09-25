import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();

  const defaultLocale = "en"; // load from the user's preferences
  const clientSideLanguageChange = async (newLocale: "en" | "fr") => {
    await i18n.changeLanguage(newLocale);
  };

  return (
    <Select
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onValueChange={clientSideLanguageChange}
      // defaultValue={i18n.language}
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
