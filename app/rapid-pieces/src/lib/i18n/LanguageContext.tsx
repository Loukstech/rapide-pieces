'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, getTranslation } from './translations';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'rapid-pieces-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    let text = getTranslation(language, path);
    
    // Replace parameters in the text
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, String(value));
      });
    }
    
    return text;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback for SSR or when provider is not available
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (path: string, params?: Record<string, string | number>) => {
        // Try to get translation from the default translations
        let text = path;
        const keys = path.split('.');
        let value: any = translations['fr'];
        
        for (const key of keys) {
          value = value?.[key];
        }
        
        text = value || path;
        
        // Replace parameters
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            text = text.replace(`{${key}}`, String(value));
          });
        }
        
        return text;
      },
    };
  }
  return context;
}
