// useT — drop-in translation hook
// Usage: const { t } = useT();  then:  t("form_heading") → current language string
import { useApp } from "../context/AppContext";
import { t as translate, SupportedLanguage } from "./translations";

export function useT() {
  const { currentLanguage } = useApp();
  const lang = currentLanguage as SupportedLanguage;
  return {
    t: (key: string) => translate(key, lang),
    lang,
  };
}
