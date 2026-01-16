/**
 * Error message utility for i18n support
 * Maps API errors to user-friendly messages using i18next
 */

import i18n from '@/i18n';

/**
 * Get an error message by key path using i18next
 * @param keyPath - Dot-separated path like "errors.invalid_credentials" or "validation.field_required"
 * @param namespace - Optional namespace (defaults to 'common' for validation/general, 'auth' for auth errors)
 * @param params - Optional parameters for message interpolation
 * @returns The error message or the key path if not found
 */
export function getErrorMessage(
  keyPath: string,
  namespace?: 'auth' | 'common',
  params?: Record<string, string | number>
): string {
  // Determine namespace based on key path if not provided
  let ns: 'auth' | 'common' = namespace || 'common';
  
  // Auto-detect namespace from key path
  if (!namespace) {
    if (keyPath.startsWith('errors.') && !keyPath.startsWith('errors.general.') && !keyPath.startsWith('errors.api.') && !keyPath.startsWith('errors.resources.')) {
      ns = 'auth';
    } else if (keyPath.startsWith('validation.')) {
      ns = 'common';
    } else if (keyPath.startsWith('errors.general.') || keyPath.startsWith('errors.api.') || keyPath.startsWith('errors.resources.')) {
      ns = 'common';
    }
  }
  
  // Use i18next to get the translation
  try {
    return i18n.t(keyPath, { ns, ...params });
  } catch (error) {
    // Fallback to key path if translation fails
    return keyPath;
  }
}

/**
 * Get resource name for API error messages
 */
function getResourceName(resource?: string): string {
  if (!resource) return 'data';
  return getErrorMessage(`errors.resources.${resource}`, 'common', {}) || resource;
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
        return getErrorMessage('errors.invalid_credentials', 'auth');
      }
      if (message.toLowerCase().includes('expired') || 
          message.toLowerCase().includes('session')) {
        return getErrorMessage('errors.session_expired', 'auth');
      }
    }
    return getErrorMessage('errors.invalid_credentials', 'auth');
  }
  
  // Handle 403 Forbidden
  if (status === 403) {
    if (typeof message === 'string' && 
        (message.toLowerCase().includes('verify') || 
         message.toLowerCase().includes('verification'))) {
      return getErrorMessage('errors.email_not_verified', 'auth');
    }
    return getErrorMessage('errors.forbidden', 'auth');
  }
  
  // Handle specific error messages from backend
  if (typeof message === 'string') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('email already registered') || 
        lowerMessage.includes('email address is already registered')) {
      return getErrorMessage('errors.email_already_registered', 'auth');
    }
    
    if (lowerMessage.includes('phone already registered') || 
        lowerMessage.includes('phone number is already registered')) {
      return getErrorMessage('errors.phone_already_registered', 'auth');
    }
    
    if (lowerMessage.includes('email verification required') ||
        lowerMessage.includes('verify your email')) {
      return getErrorMessage('errors.email_verification_required', 'auth');
    }
    
    if (lowerMessage.includes('otp') && 
        (lowerMessage.includes('expired') || lowerMessage.includes('invalid'))) {
      return getErrorMessage('errors.otp_invalid', 'auth');
    }
    
    if (lowerMessage.includes('too many attempts')) {
      return getErrorMessage('errors.otp_too_many_attempts', 'auth');
    }
    
    if (lowerMessage.includes('password reset')) {
      return getErrorMessage('errors.password_reset_failed', 'auth');
    }
  }
  
  // Default auth error
  return getErrorMessage('errors.login_failed', 'auth');
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
        const message = getErrorMessage(messageKey, 'common', params);
        
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
    return getErrorMessage('errors.general.not_found', 'common');
  }
  
  if (status === 400) {
    return getErrorMessage('errors.general.bad_request', 'common');
  }
  
  if (status === 500) {
    return getErrorMessage('errors.general.server_error', 'common');
  }
  
  if (status === 422) {
    // Validation errors are handled separately
    return getErrorMessage('errors.api.validation_errors', 'common');
  }
  
  // Check for specific error messages
  const message = error?.response?.data?.message || error?.response?.data?.detail;
  if (typeof message === 'string') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('create') || lowerMessage.includes('created')) {
      return getErrorMessage('errors.api.create_failed', 'common', { resource: resourceName });
    }
    
    if (lowerMessage.includes('update') || lowerMessage.includes('updated')) {
      return getErrorMessage('errors.api.update_failed', 'common', { resource: resourceName });
    }
    
    if (lowerMessage.includes('delete') || lowerMessage.includes('deleted')) {
      return getErrorMessage('errors.api.delete_failed', 'common', { resource: resourceName });
    }
    
    if (lowerMessage.includes('fetch') || lowerMessage.includes('get') || lowerMessage.includes('retrieve')) {
      return getErrorMessage('errors.api.fetch_failed', 'common', { resource: resourceName });
    }
    
    if (lowerMessage.includes('save')) {
      return getErrorMessage('errors.api.save_failed', 'common', { resource: resourceName });
    }
  }
  
  // Default API error
  return getErrorMessage('errors.api.operation_failed', 'common');
}


