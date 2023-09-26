import i18next from "i18next";

await i18next.init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        "prompt-length-error": "Prompt must be at least 5 characters long",
      },
    },
    fr: {
      translation: {
        "prompt-length-error": "Le prompt doit contenir au moins 5 caractères",
      },
    },
  },
});

export default i18next;
