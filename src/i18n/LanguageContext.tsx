import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language, TranslationDictionary } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { getLocalizedStep } from './experimentTranslations';
import { translateDynamicMessage } from './dynamicTranslations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (
    key: string,
    paramsOrFallback?: Record<string, string | number> | string,
    fallback?: string
  ) => string;
  tStep: (
    expId: string,
    stepId: string,
    fallbackTitle: string,
    fallbackInstruction: string
  ) => { title: string; instruction: string; doGuidance?: string; dontGuidance?: string };
  tDynamic: (message: string | null | undefined) => string;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  hi,
  mr,
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('vv_language');
      if (saved === 'en' || saved === 'hi' || saved === 'mr') {
        return saved;
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vv_language', lang);
    } catch {
      // Ignore localStorage write errors
    }
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (
      key: string,
      paramsOrFallback?: Record<string, string | number> | string,
      fallback?: string
    ): string => {
      const defaultText = typeof paramsOrFallback === 'string' ? paramsOrFallback : fallback || key;
      const dict = dictionaries[language];
      let val = dict?.[key] || dictionaries.en[key] || defaultText;
      if (typeof paramsOrFallback === 'object' && paramsOrFallback !== null) {
        Object.entries(paramsOrFallback).forEach(([k, v]) => {
          val = val.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
      }
      return val;
    },
    [language]
  );

  const tStep = useCallback(
    (
      expId: string,
      stepId: string,
      fallbackTitle: string,
      fallbackInstruction: string
    ) => {
      return getLocalizedStep(expId, stepId, language, fallbackTitle, fallbackInstruction);
    },
    [language]
  );

  const tDynamic = useCallback(
    (message: string | null | undefined): string => {
      return translateDynamicMessage(message, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tStep, tDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
