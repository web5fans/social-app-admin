import "i18next";
import resources from "@/i18n/locales/index";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: typeof resources["zh-CN"];
  }
}
