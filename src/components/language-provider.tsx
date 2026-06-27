'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type Language, translateText, translations } from '@/lib/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);


export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('language') as Language | null;
    if (saved === 'th' || saved === 'en') setLanguageState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (text) => translateText(text, language)
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'en' as Language, setLanguage: () => undefined, t: (text: string) => text };
  }
  return context;
}

export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}

export function L({ en, th }: { en: string; th: string }) {
  const { language } = useLanguage();
  return <>{language === 'th' ? th : en}</>;
}

