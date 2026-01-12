export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const NAMESPACES = ['common', 'landing', 'auth', 'dashboard'] as const;

export type Namespace = (typeof NAMESPACES)[number];




