/**
 * Internationalized date and time formatting utilities
 * These utilities respect the current language setting and provide
 * translated date/time formats for common UI components.
 */

import { useLanguage } from '@/i18n/hooks';
import { useAppTranslation } from '@/i18n/hooks';
import { SupportedLanguage } from '@/i18n/constants';

/**
 * Locale mapping for date formatting based on language
 */
const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-US',
  ar: 'en-US', // Use Gregorian calendar, but we'll replace month names manually
};

/**
 * Levantine Arabic month names (Gregorian calendar months)
 */
const ARABIC_MONTHS: Record<number, string> = {
  1: 'كانون الثاني',
  2: 'شباط',
  3: 'آذار',
  4: 'نيسان',
  5: 'أيار',
  6: 'حزيران',
  7: 'تموز',
  8: 'آب',
  9: 'أيلول',
  10: 'تشرين الأول',
  11: 'تشرين الثاني',
  12: 'كانون الأول',
};

/**
 * Format a date string to a localized date display
 * For Arabic: Uses Gregorian calendar but with Levantine Arabic month names
 * @param dateString - ISO date string or date string in YYYY-MM-DD format
 * @param options - Intl.DateTimeFormatOptions for date formatting
 * @param language - Optional language override (defaults to current language)
 * @returns Formatted date string
 */
export const formatDateLocalized = (
  dateString?: string | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
  language?: SupportedLanguage
): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  // Determine language
  const currentLanguage: SupportedLanguage = language 
    ? language
    : typeof window !== 'undefined' 
      ? (getCurrentLanguageFromStorage() as SupportedLanguage) || 'en'
      : 'en';
  
  // For Arabic, use custom formatting with Arabic month names
  if (currentLanguage === 'ar') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const monthName = ARABIC_MONTHS[month];
    
    // Format based on options
    if (options.month === 'short' || options.month === 'long') {
      // Format: "15 كانون الثاني 2024"
      return `${day} ${monthName} ${year}`;
    } else if (options.month === 'numeric') {
      // If numeric month requested, still use Gregorian calendar but Arabic locale
      const locale = LOCALE_MAP.ar;
      return date.toLocaleDateString(locale, options);
    } else {
      // Default: "15 كانون الثاني 2024"
      return `${day} ${monthName} ${year}`;
    }
  }
  
  // For English and other languages, use standard locale formatting
  const locale = LOCALE_MAP[currentLanguage] || LOCALE_MAP.en;
  return date.toLocaleDateString(locale, options);
};

/**
 * Get current language from localStorage (fallback helper for non-hook contexts)
 */
function getCurrentLanguageFromStorage(): string {
  try {
    return localStorage.getItem('i18nextLng') || 'en';
  } catch {
    return 'en';
  }
}

/**
 * Hook-based utility for formatting relative time with translations
 * This uses the translation system to return localized relative time strings
 * 
 * Usage:
 * ```tsx
 * const formatRelativeTime = useFormatRelativeTime();
 * const timeStr = formatRelativeTime('2024-01-15'); // "Yesterday" or "أمس"
 * ```
 */
export function useFormatRelativeTime() {
  const { t } = useAppTranslation('dashboard');
  const language = useLanguage();
  
  return (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('recent_resumes.today');
    if (diffInDays === 1) return t('recent_resumes.yesterday');
    if (diffInDays < 7) return t('recent_resumes.days_ago', { count: diffInDays });
    if (diffInDays < 30) return t('recent_resumes.weeks_ago', { count: Math.floor(diffInDays / 7) });
    if (diffInDays < 365) return t('recent_resumes.months_ago', { count: Math.floor(diffInDays / 30) });
    return t('recent_resumes.years_ago', { count: Math.floor(diffInDays / 365) });
  };
}

/**
 * Hook-based utility for formatting dates with localization
 * This respects the current language setting
 * 
 * Usage:
 * ```tsx
 * const formatDate = useFormatDate();
 * const dateStr = formatDate('2024-01-15'); // "Jan 15, 2024" or localized Arabic
 * ```
 */
export function useFormatDate() {
  const language = useLanguage();
  
  return (
    dateString?: string | null,
    options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }
  ): string => {
    return formatDateLocalized(dateString, options, language);
  };
}

/**
 * Common date formatting utilities that work without hooks
 * Useful for utility functions that can't use React hooks
 */
export const dateFormatter = {
  /**
   * Format date using current language from localStorage
   */
  format: (dateString?: string | null, options?: Intl.DateTimeFormatOptions): string => {
    return formatDateLocalized(dateString, options);
  },
  
  /**
   * Format relative time (requires manual translation lookup - prefer useFormatRelativeTime hook)
   */
  formatRelative: (dateString?: string | null, t?: (key: string, params?: any) => string): string => {
    if (!dateString || !t) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('dashboard:recent_resumes.today');
    if (diffInDays === 1) return t('dashboard:recent_resumes.yesterday');
    if (diffInDays < 7) return t('dashboard:recent_resumes.days_ago', { count: diffInDays });
    if (diffInDays < 30) return t('dashboard:recent_resumes.weeks_ago', { count: Math.floor(diffInDays / 7) });
    if (diffInDays < 365) return t('dashboard:recent_resumes.months_ago', { count: Math.floor(diffInDays / 30) });
    return t('dashboard:recent_resumes.years_ago', { count: Math.floor(diffInDays / 365) });
  },
};

