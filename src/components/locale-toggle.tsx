import { t, type DictionaryKey } from "@/lib/i18n";

export function useTranslation() {
  return {
    t: (key: DictionaryKey) => t(key),
  };
}
