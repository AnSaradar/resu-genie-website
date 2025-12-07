/**
 * Error message utility for i18n support
 * Maps API errors to user-friendly messages stored in JSON
 */

import errorMessages from '@/locales/errors.json';

type Locale = 'en' | 'ar';
type ErrorCategory = 'auth' | 'validation' | 'general' | 'api' | 'resources';

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
 * Get an error message by key path
 * @param keyPath - Dot-separated path like "auth.invalid_credentials"
 * @param locale - Optional locale (defaults to current locale)
 * @param params - Optional parameters for message interpolation
 * @returns The error message or the key path if not found
 */
export function getErrorMessage(
  keyPath: string,
  locale?: Locale,
  params?: Record<string, string | number>
): string {
  const currentLocale = locale || getCurrentLocale();
  const keys = keyPath.split('.');
  
  // Navigate through the error messages object
  let message: any = errorMessages[currentLocale] || errorMessages[DEFAULT_LOCALE];
  
  for (const key of keys) {
    if (message && typeof message === 'object' && key in message) {
      message = message[key];
    } else {
      // Fallback to English if key not found in current locale
      message = errorMessages[DEFAULT_LOCALE];
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

/**
 * Get resource name for API error messages
 */
function getResourceName(resource?: string): string {
  if (!resource) return 'data';
  return getErrorMessage(`resources.${resource}`, undefined, {}) || resource;
}

/**
 * Map authentication errors to message keys
 */
export function mapAuthError(error: any): string {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = data?.message || data?.detail;
  
  // Handle 401 Unauthorized
  if (status === 401) {
    if (typeof message === 'string') {
      // Check for specific error messages from backend
      if (message.toLowerCase().includes('invalid') || 
          message.toLowerCase().includes('incorrect') ||
          message.toLowerCase().includes('email or password')) {
        return getErrorMessage('auth.invalid_credentials');
      }
      if (message.toLowerCase().includes('expired') || 
          message.toLowerCase().includes('session')) {
        return getErrorMessage('auth.session_expired');
      }
    }
    return getErrorMessage('auth.invalid_credentials');
  }
  
  // Handle 403 Forbidden
  if (status === 403) {
    if (typeof message === 'string' && 
        (message.toLowerCase().includes('verify') || 
         message.toLowerCase().includes('verification'))) {
      return getErrorMessage('auth.email_not_verified');
    }
    return getErrorMessage('auth.forbidden');
  }
  
  // Handle specific error messages from backend
  if (typeof message === 'string') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('email already registered') || 
        lowerMessage.includes('email address is already registered')) {
      return getErrorMessage('auth.email_already_registered');
    }
    
    if (lowerMessage.includes('phone already registered') || 
        lowerMessage.includes('phone number is already registered')) {
      return getErrorMessage('auth.phone_already_registered');
    }
    
    if (lowerMessage.includes('email verification required') ||
        lowerMessage.includes('verify your email')) {
      return getErrorMessage('auth.email_verification_required');
    }
    
    if (lowerMessage.includes('otp') && 
        (lowerMessage.includes('expired') || lowerMessage.includes('invalid'))) {
      return getErrorMessage('auth.otp_invalid');
    }
    
    if (lowerMessage.includes('too many attempts')) {
      return getErrorMessage('auth.otp_too_many_attempts');
    }
    
    if (lowerMessage.includes('password reset')) {
      return getErrorMessage('auth.password_reset_failed');
    }
  }
  
  // Default auth error
  return getErrorMessage('auth.login_failed');
}

/**
 * Map validation errors to message keys
 * Returns an array of formatted error messages
 */
export function mapValidationError(error: any): string[] {
  const errors: string[] = [];
  
  // Handle FastAPI 422 validation errors
  if (error?.response?.status === 422 && error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    
    if (Array.isArray(detail)) {
      // FastAPI validation errors format: [{loc: [...], msg: "...", type: "..."}]
      detail.forEach((err: any) => {
        const fieldPath = err.loc || [];
        const fieldName = fieldPath[fieldPath.length - 1] || 'field';
        const backendMessage = err.msg || '';
        
        // Map backend validation messages to our keys
        let messageKey = 'validation.field_required';
        let params: Record<string, string> | undefined;
        
        if (backendMessage.toLowerCase().includes('required') ||
            backendMessage.toLowerCase().includes('field required')) {
          messageKey = 'validation.field_required';
        } else if (backendMessage.toLowerCase().includes('invalid')) {
          messageKey = 'validation.field_invalid';
        } else if (backendMessage.toLowerCase().includes('email')) {
          messageKey = 'validation.email_invalid';
        } else if (backendMessage.toLowerCase().includes('password')) {
          if (backendMessage.toLowerCase().includes('short')) {
            messageKey = 'validation.password_too_short';
          } else if (backendMessage.toLowerCase().includes('match')) {
            messageKey = 'validation.password_mismatch';
          }
        } else if (backendMessage.toLowerCase().includes('date')) {
          messageKey = 'validation.date_invalid';
        } else if (backendMessage.toLowerCase().includes('min length')) {
          const minMatch = backendMessage.match(/min length (\d+)/i);
          if (minMatch) {
            messageKey = 'validation.min_length';
            params = { min: minMatch[1] };
          }
        } else if (backendMessage.toLowerCase().includes('max length')) {
          const maxMatch = backendMessage.match(/max length (\d+)/i);
          if (maxMatch) {
            messageKey = 'validation.max_length';
            params = { max: maxMatch[1] };
          }
        }
        
        // Format field name for display
        const displayFieldName = fieldName
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
        
        // Get the message
        const message = getErrorMessage(messageKey, undefined, params);
        
        // Combine field name and message
        errors.push(`${displayFieldName}: ${message}`);
      });
    } else if (typeof detail === 'string') {
      errors.push(detail);
    }
  }
  
  // Handle controller validation errors (critical_errors array)
  if (error?.response?.data?.critical_errors && Array.isArray(error.response.data.critical_errors)) {
    error.response.data.critical_errors.forEach((err: string) => {
      errors.push(err);
    });
  }
  
  return errors;
}

/**
 * Map generic API errors to message keys
 */
export function mapApiError(error: any, resource?: string): string {
  const status = error?.response?.status;
  const resourceName = getResourceName(resource);
  
  // Handle specific status codes
  if (status === 404) {
    return getErrorMessage('general.not_found');
  }
  
  if (status === 400) {
    return getErrorMessage('general.bad_request');
  }
  
  if (status === 500) {
    return getErrorMessage('general.server_error');
  }
  
  if (status === 422) {
    // Validation errors are handled separately
    return getErrorMessage('api.validation_errors');
  }
  
  // Check for specific error messages
  const message = error?.response?.data?.message || error?.response?.data?.detail;
  if (typeof message === 'string') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('create') || lowerMessage.includes('created')) {
      return getErrorMessage('api.create_failed', undefined, { resource: resourceName });
    }
    
    if (lowerMessage.includes('update') || lowerMessage.includes('updated')) {
      return getErrorMessage('api.update_failed', undefined, { resource: resourceName });
    }
    
    if (lowerMessage.includes('delete') || lowerMessage.includes('deleted')) {
      return getErrorMessage('api.delete_failed', undefined, { resource: resourceName });
    }
    
    if (lowerMessage.includes('fetch') || lowerMessage.includes('get') || lowerMessage.includes('retrieve')) {
      return getErrorMessage('api.fetch_failed', undefined, { resource: resourceName });
    }
    
    if (lowerMessage.includes('save')) {
      return getErrorMessage('api.save_failed', undefined, { resource: resourceName });
    }
  }
  
  // Default API error
  return getErrorMessage('api.operation_failed');
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  try {
    localStorage.setItem('locale', locale);
  } catch {
    // Ignore localStorage errors
  }
}

