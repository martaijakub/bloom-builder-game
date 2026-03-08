import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "pl" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (pl: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "pl",
  setLang: () => {},
  t: (pl) => pl,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("pl");
  const t = useCallback((pl: string, en: string) => (lang === "pl" ? pl : en), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
