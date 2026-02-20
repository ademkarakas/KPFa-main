import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Language } from "../types";
import i18n from "../src/i18n/config";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const getInitialLanguage = (): Language => {
    // 1. Check URL query params (best for SEO crawlers)
    const urlParams = new URLSearchParams(globalThis.location.search);
    const langParam = urlParams.get("lang");
    if (langParam === "de" || langParam === "tr") return langParam;

    // 2. Check localStorage
    const stored = globalThis.localStorage?.getItem("i18nextLng");
    if (stored === "de" || stored === "tr") return stored;

    // 3. Fallback to default
    return "de";
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem("i18nextLng", language);
    } catch {
      // ignore storage failures
    }
    i18n.changeLanguage(language);
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
