/**
 * General messages utility for i18n support
 * Provides localized messages for toast notifications and UI elements
 */

import messages from '@/locales/messages.json';

type Locale = 'en' | 'ar';

// Default locale
const DEFAULT_LOCALE: Locale = 'en';

/**
 * Get the current locale from localStorage or default to 'en'
 */
function getCurrentLocale(): Locale {
  try {
    const stored = localStorage.getItem('locale');
    if (stored === 'ar' || stored === 'en') {
      return stored;
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_LOCALE;
}

/**
 * Get a message by key path
 * @param keyPath - Dot-separated path like "toast.register_required"
 * @param locale - Optional locale (defaults to current locale)
 * @param params - Optional parameters for message interpolation
 * @returns The message or the key path if not found
 */
export function getMessage(
  keyPath: string,
  locale?: Locale,
  params?: Record<string, string | number>
): string {
  const currentLocale = locale || getCurrentLocale();
  const keys = keyPath.split('.');
  
  // Navigate through the messages object
  let message: any = messages[currentLocale] || messages[DEFAULT_LOCALE];
  
  for (const key of keys) {
    if (message && typeof message === 'object' && key in message) {
      message = message[key];
    } else {
      // Fallback to English if key not found in current locale
      message = messages[DEFAULT_LOCALE];
      for (const fallbackKey of keys) {
        if (message && typeof message === 'object' && fallbackKey in message) {
          message = message[fallbackKey];
        } else {
          return keyPath; // Return key path if message not found
        }
      }
      break;
    }
  }
  
  // If message is a string, interpolate params if provided
  if (typeof message === 'string' && params) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }
  
  return typeof message === 'string' ? message : keyPath;
}

