import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, Namespace } from './constants';

/**
 * Base resources loaded eagerly.
 * For now we load common + landing + auth + onboarding for both languages.
 * Later we can switch to lazy-loading per route if needed.
 */
import enCommon from '@/locales/en/common.json';
import enLanding from '@/locales/en/landing.json';
import enAuth from '@/locales/en/auth.json';
import enOnboarding from '@/locales/en/onboarding.json';
import enDashboard from '@/locales/en/dashboard.json';
import arCommon from '@/locales/ar/common.json';
import arLanding from '@/locales/ar/landing.json';
import arAuth from '@/locales/ar/auth.json';
import arOnboarding from '@/locales/ar/onboarding.json';
import arDashboard from '@/locales/ar/dashboard.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    auth: enAuth,
    onboarding: enOnboarding,
    dashboard: enDashboard,
  },
  ar: {
    common: arCommon,
    landing: arLanding,
    auth: arAuth,
    onboarding: arOnboarding,
    dashboard: arDashboard,
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
      ns: ['common', 'landing', 'auth', 'onboarding', 'dashboard'] satisfies Namespace[],
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




