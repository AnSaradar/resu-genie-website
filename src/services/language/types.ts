export interface LanguageData {
  name: string;
  proficiency: string;
  is_native?: boolean;
}

export interface LanguageUpdateData {
  name?: string;
  proficiency?: string;
  is_native?: boolean;
}

export interface LanguageResponse {
  id: string; // MongoDB ObjectId as string
  name: string;
  proficiency: string;
  is_native: boolean;
}

// Frontend-friendly interface used across the Resume Generator UI
export interface Language {
  id: string;
  name: string;
  proficiency: string;
  isNative: boolean;
}

// Generic API wrapper returned by backend for languages endpoints
export interface LanguageApiResponse {
  signal: string;
  languages?: LanguageResponse[];
  language?: LanguageResponse;
} 