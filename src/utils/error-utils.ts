/**
 * Shared utilities for parsing and extracting error messages from API responses.
 * Handles FastAPI validation errors, custom error formats, and provides fallback messages.
 */

export interface ValidationError {
  field: string;
  message: string;
  path?: string[];
}

/**
 * Extracts a user-friendly error message from an API error response.
 * Handles FastAPI 422 validation errors, custom error formats, and generic errors.
 * 
 * @param error - The error object from an API call (typically from axios/react-query)
 * @param fallback - Optional fallback message if no error message can be extracted
 * @returns A user-friendly error message string
 */
export function extractApiErrorMessage(
  error: any,
  fallback: string = 'An unexpected error occurred. Please try again.'
): string {
  // Check for FastAPI validation errors (422 with detail array)
  if (error?.response?.status === 422 && error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    
    if (Array.isArray(detail)) {
      // FastAPI validation errors format: [{loc: [...], msg: "...", type: "..."}]
      const messages = detail.map((err: any) => {
        const fieldPath = err.loc?.join('.') || '';
        const message = err.msg || 'Field is required';
        
        // Map to user-friendly field names
        let fieldName = fieldPath.split('.').pop() || 'field';
        fieldName = fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        
        return `${fieldName}: ${message}`;
      });
      
      return messages.length === 1 ? messages[0] : `Validation errors: ${messages.join('; ')}`;
    } else if (typeof detail === 'string') {
      return detail;
    }
  }
  
  // Check for controller validation errors (critical_errors array)
  if (error?.response?.data?.critical_errors && Array.isArray(error.response.data.critical_errors)) {
    const errors = error.response.data.critical_errors;
    return errors.length === 1 ? errors[0] : `Multiple errors: ${errors.join('; ')}`;
  }
  
  // Check for message field
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for detail as string (non-array)
  if (error?.response?.data?.detail && typeof error.response.data.detail === 'string') {
    return error.response.data.detail;
  }
  
  // Check for generic error message
  if (error?.message) {
    return error.message;
  }
  
  return fallback;
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
 * 
 * @param error - The error object from an API call
 * @returns Array of formatted error message strings
 */
export function formatValidationErrors(error: any): string[] {
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

