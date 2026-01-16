import { initI18n } from './config';
import i18n from 'i18next';

// Initialize i18n once on app startup
initI18n();

export default i18n;
export * from './constants';
export * from './hooks';
export * from './types';




