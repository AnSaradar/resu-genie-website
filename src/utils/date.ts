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


