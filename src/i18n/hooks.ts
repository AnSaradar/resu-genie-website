import { useTranslation as useI18NextTranslation } from 'react-i18next';
import { Namespace, RTL_LANGUAGES, SupportedLanguage } from './constants';
import { TranslationKey } from './types';

export const useAppTranslation = <N extends Namespace = 'common' | 'landing'>(
  ns: N,
) => {
  const { t, i18n } = useI18NextTranslation(ns);

  const translate = (key: TranslationKey<N>, options?: Record<string, any>) =>
    t(key as string, options);

  const changeLanguage = (lng: SupportedLanguage) => {
    void i18n.changeLanguage(lng);
  };

  return {
    t: translate,
    i18n,
    language: i18n.language as SupportedLanguage,
    changeLanguage,
  };
};

export const useLanguage = () => {
  const { i18n } = useI18NextTranslation();
  return i18n.language as SupportedLanguage;
};

export const useDirection = () => {
  const lang = useLanguage();
  const dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  return { dir, lang };
};




