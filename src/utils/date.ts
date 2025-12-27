// Shared date utilities for month-based inputs and display across components

export const normalizeMonthValue = (value: string | undefined | null): string => {
  if (!value) return '';
  // Accept both YYYY-MM and YYYY-MM-DD, always output YYYY-MM for month inputs
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.slice(0, 7);
  if (/^\d{4}-\d{2}$/.test(value)) return value;
  // Fallback: try Date parse and return YYYY-MM
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }
  return '';
};

export const toDisplayMonth = (value: string | undefined | null): string => {
  const month = normalizeMonthValue(value);
  if (!month) return '';
  const d = new Date(month + '-01');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

export const monthToIsoDate = (monthValue: string | undefined | null): string | undefined => {
  if (!monthValue) return undefined;
  const normalized = normalizeMonthValue(monthValue);
  if (!normalized) return undefined;
  return `${normalized}-01`;
};

/**
 * Generic date formatting utility that handles year-month only dates (YYYY-MM)
 * and full dates (YYYY-MM-DD). For year-month only dates, automatically sets
 * the day to 01 before formatting.
 * 
 * @param dateString - Date string in YYYY-MM or YYYY-MM-DD format
 * @param options - Intl.DateTimeFormatOptions for date formatting
 * @returns Formatted date string or empty string if invalid
 * 
 * @example
 * formatDate('2024-12') // Returns "Dec 2024"
 * formatDate('2024-12-15') // Returns "Dec 15, 2024"
 * formatDate('2024-12', { year: 'numeric', month: 'long' }) // Returns "December 2024"
 */
export const formatDate = (
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }
): string => {
  if (!dateString) return '';
  
  // Normalize the date string to ensure it's in a valid format
  let normalizedDate: string = dateString.trim();
  
  // Check if it's already a full date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    // Already a full date, use as-is
    const date = new Date(normalizedDate);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', options);
  }
  
  // Check if it's year-month only (YYYY-MM)
  if (/^\d{4}-\d{2}$/.test(normalizedDate)) {
    // Append '-01' to make it a valid date
    normalizedDate = `${normalizedDate}-01`;
    const date = new Date(normalizedDate);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', options);
  }
  
  // Try to parse as-is (handles other valid date formats)
  const date = new Date(normalizedDate);
  if (isNaN(date.getTime())) {
    // If parsing fails, try to extract year-month pattern
    const yearMonthMatch = normalizedDate.match(/(\d{4})-(\d{1,2})/);
    if (yearMonthMatch) {
      const [, year, month] = yearMonthMatch;
      const paddedMonth = month.padStart(2, '0');
      normalizedDate = `${year}-${paddedMonth}-01`;
      const fallbackDate = new Date(normalizedDate);
      if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate.toLocaleDateString('en-US', options);
      }
    }
    return '';
  }
  
  return date.toLocaleDateString('en-US', options);
};


