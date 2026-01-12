import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, Namespace } from './constants';

/**
 * Base resources loaded eagerly.
 * For now we load common + landing for both languages.
 * Later we can switch to lazy-loading per route if needed.
 */
import enCommon from '@/locales/en/common.json';
import enLanding from '@/locales/en/landing.json';
import arCommon from '@/locales/ar/common.json';
import arLanding from '@/locales/ar/landing.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
  },
  ar: {
    common: arCommon,
    landing: arLanding,
  },
} as const;

type ResourceLanguage = keyof typeof resources;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['en'];
  }
}

const initI18n = () => {
  if (i18n.isInitialized) {
    return i18n;
  }

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: FALLBACK_LANGUAGE,
      lng: DEFAULT_LANGUAGE,
      supportedLngs: Object.keys(resources) as ResourceLanguage[],
      ns: ['common', 'landing'] satisfies Namespace[],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
      load: 'currentOnly',
      debug: import.meta.env.DEV,
      returnEmptyString: false,
    });

  return i18n;
};

export { initI18n };




