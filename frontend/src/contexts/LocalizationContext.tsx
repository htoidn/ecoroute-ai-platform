import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // t supports simple interpolation like t('found', {count: 3, name: 'x'})
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // prefer language from localStorage, fall back to i18next's current language or 'en'
    let saved: Language | undefined;
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        saved = (window.localStorage.getItem('language') as Language) || undefined;
      }
    } catch (e) {
      saved = undefined;
    }
    return saved || (i18n.language as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem('language', lang);
      }
    } catch (e) {
      // ignore
    }
    // sync with i18next so components using react-i18next update
    void i18n.changeLanguage(lang);
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    // use i18next for translations and interpolation (configured to support {var} style)
    if (vars) return i18n.t(key, vars as Record<string, unknown>);
    return i18n.t(key);
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    // Provide a safe fallback so components that use the hook outside of tests/app wrapper
    // still work during unit tests and SSR.
    const fallbackLanguage: Language = (() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
          return (window.localStorage.getItem('language') as Language) || (i18n.language as Language) || 'en';
        }
      } catch (e) {
        // ignore
      }
      return (i18n.language as Language) || 'en';
    })();

    const fallback: LocalizationContextType = {
      language: fallbackLanguage,
      setLanguage: (lang: Language) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
            window.localStorage.setItem('language', lang);
          }
        } catch (e) {
          /* ignore */
        }
        void i18n.changeLanguage(lang);
      },
      t: (key: string, vars?: Record<string, string | number>) => {
        if (vars) return i18n.t(key, vars as Record<string, unknown>);
        return i18n.t(key);
      },
    };
    return fallback;
  }
  return context;
}

