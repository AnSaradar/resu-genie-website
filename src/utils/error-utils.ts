/**
 * Shared utilities for parsing and extracting error messages from API responses.
 * Handles FastAPI validation errors, custom error formats, and provides fallback messages.
 * Uses i18n error messages from JSON files.
 */

import { mapAuthError, mapValidationError, mapApiError, getErrorMessage } from './error-messages';

export interface ValidationError {
  field: string;
  message: string;
  path?: string[];
}

/**
 * Extracts a user-friendly error message from an API error response.
 * Handles FastAPI 422 validation errors, custom error formats, and generic errors.
 * Uses i18n error messages from JSON files.
 * 
 * @param error - The error object from an API call (typically from axios/react-query)
 * @param fallback - Optional fallback message key (defaults to 'general.unexpected_error')
 * @param resource - Optional resource name for API error messages (e.g., 'education', 'experience')
 * @returns A user-friendly error message string
 */
/**
 * Check if error is a token limit exceeded error
 */
export function isTokenLimitError(error: any): boolean {
  const status = error?.response?.status;
  if (status !== 403) return false;
  
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') {
    const lowerDetail = detail.toLowerCase();
    return lowerDetail.includes('token limit') || 
           lowerDetail.includes('token limit exceeded') ||
           lowerDetail.includes('reached your token limit') ||
           lowerDetail.includes('insufficient tokens');
  }
  
  return false;
}

export function extractApiErrorMessage(
  error: any,
  fallback?: string,
  resource?: string
): string {
  const status = error?.response?.status;
  
  // Handle token limit errors first (403 with token limit message)
  if (isTokenLimitError(error)) {
    return "You don't have enough tokens to use this feature. Please check your token balance.";
  }
  
  // Handle 500 server errors immediately - return generic message without exposing error details
  if (status === 500) {
    return getErrorMessage('general.server_error');
  }
  
  // Handle authentication errors (401, 403)
  if (status === 401 || status === 403) {
    return mapAuthError(error);
  }
  
  // Handle validation errors (422)
  if (status === 422) {
    const validationErrors = mapValidationError(error);
    if (validationErrors.length > 0) {
      // For single validation error, return it directly
      if (validationErrors.length === 1) {
        return validationErrors[0];
      }
      // For multiple errors, return formatted message
      return getErrorMessage('validation.multiple_errors') + ': ' + validationErrors.join('; ');
    }
    // Fallback if validation mapping didn't work
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
  }
  
  // Handle other API errors
  if (status) {
    const apiError = mapApiError(error, resource);
    if (apiError) {
      return apiError;
    }
  }
  
  // Check for message field (backward compatibility)
  if (error?.response?.data?.message) {
    const message = error.response.data.message;
    // If it's a known auth error message, map it
    if (typeof message === 'string' && 
        (message.toLowerCase().includes('invalid') || 
         message.toLowerCase().includes('incorrect') ||
         message.toLowerCase().includes('email or password'))) {
      return mapAuthError(error);
    }
    return message;
  }
  
  // Check for detail as string (non-array) - backward compatibility
  if (error?.response?.data?.detail && typeof error.response.data.detail === 'string') {
    return error.response.data.detail;
  }
  
  // Check for generic error message
  if (error?.message) {
    // If it's already a user-friendly message, return it
    if (typeof error.message === 'string') {
      return error.message;
    }
  }
  
  // Use fallback or default
  if (fallback) {
    // If fallback is a key path, get the message
    if (fallback.includes('.')) {
      return getErrorMessage(fallback);
    }
    return fallback;
  }
  
  return getErrorMessage('general.unexpected_error');
}

/**
 * Extracts validation errors from an API error response and returns them as structured objects.
 * Useful for mapping errors to specific form fields or steps.
 * 
 * @param error - The error object from an API call
 * @returns Array of validation error objects with field paths and messages
 */
export function extractValidationMessages(error: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Check for FastAPI validation errors (422 with detail array)
  if (error?.response?.status === 422 && error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    
    if (Array.isArray(detail)) {
      detail.forEach((err: any) => {
        const fieldPath = err.loc?.join('.') || '';
        const message = err.msg || 'Field is required';
        
        errors.push({
          field: fieldPath.split('.').pop() || 'field',
          message,
          path: err.loc || [],
        });
      });
    }
  }
  
  // Check for controller validation errors (critical_errors array)
  if (error?.response?.data?.critical_errors && Array.isArray(error.response.data.critical_errors)) {
    error.response.data.critical_errors.forEach((err: string) => {
      errors.push({
        field: 'general',
        message: err,
      });
    });
  }
  
  return errors;
}

/**
 * Formats validation errors into a user-friendly string array.
 * Useful for displaying errors in UI components.
 * Uses i18n error messages from JSON files.
 * 
 * @param error - The error object from an API call
 * @returns Array of formatted error message strings
 */
export function formatValidationErrors(error: any): string[] {
  // Use the mapping function which returns properly formatted messages
  const mappedErrors = mapValidationError(error);
  
  if (mappedErrors.length > 0) {
    return mappedErrors;
  }
  
  // Fallback to extracting validation messages (backward compatibility)
  const validationErrors = extractValidationMessages(error);
  
  return validationErrors.map((err) => {
    if (err.path && err.path.length > 0) {
      const fieldName = err.path[err.path.length - 1]
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      return `${fieldName}: ${err.message}`;
    }
    return err.message;
  });
}

/**
 * Generic service error handler that provides consistent error handling across all services.
 * Wraps service calls with standardized error extraction and formatting.
 * 
 * For 500 errors, automatically returns a generic user-friendly message without exposing technical details.
 * 
 * @param error - The error object from an API call (typically from axios)
 * @param fallback - Optional fallback message key (defaults to 'general.unexpected_error')
 * @param resource - Optional resource name for API error messages (e.g., 'resume', 'cover_letter')
 * @returns Error object with user-friendly message
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await apiClient.post('/api/v1/resume/create', data);
 *   return response.data;
 * } catch (error: any) {
 *   throw handleServiceError(error, 'api.create_failed', 'resume');
 * }
 * ```
 */
export function handleServiceError(
  error: any,
  fallback?: string,
  resource?: string
): Error {
  const message = extractApiErrorMessage(error, fallback, resource);
  return new Error(message);
}

