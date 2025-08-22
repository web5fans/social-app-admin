import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
// import resources from "./translations";
import resources from "./locales";
import { FALLBACK_LNG } from "./settings";
import { useI18nStore } from "@/store/i18n.ts";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
// const resources = getTranslations();

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: useI18nStore.getState().language!,
    resources,
    // lng: useI18nStore.getState().language!,
    // lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: FALLBACK_LNG,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

useI18nStore.subscribe(
  s => s.language,
  language => {
    i18n.changeLanguage(language!)
  }
)

export * from './settings.ts'

export default i18n;