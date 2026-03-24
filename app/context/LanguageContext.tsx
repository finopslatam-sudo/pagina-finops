'use client';

/* =====================================================
   LANGUAGE CONTEXT — FINOPSLATAM
   Gestión del idioma global (es / en)
   Persiste en localStorage
===================================================== */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type Lang = 'es' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  /* Leer preferencia guardada al montar */
  useEffect(() => {
    const stored = localStorage.getItem('finops_lang') as Lang | null;
    if (stored === 'es' || stored === 'en') setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('finops_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
