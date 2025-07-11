// Address structure matching backend common schema
export interface Address {
  city?: string;
  country: string;
}

// Seniority levels from backend enum
export enum SeniorityLevel {
  INTERN = "Intern",
  JUNIOR = "Junior", 
  MID = "Mid-level",
  SENIOR = "Senior",
  LEAD = "Lead",
  MANAGER = "Manager",
  DIRECTOR = "Director",
  EXECUTIVE = "Executive"
}

/**
 * Structure for creating a new experience entry
 * Matches ExperienceCreate DTO from backend - used throughout frontend
 */
export interface ExperienceData {
  title: string;
  seniority_level: SeniorityLevel | string;
  company: string;
  location?: Address;
  start_date: string; // ISO date string (YYYY-MM-DD)
  currently_working: boolean;
  end_date?: string; // ISO date string (YYYY-MM-DD), optional if currently_working is true
  description?: string;
  is_volunteer: boolean;
}

/**
 * Structure for updating an existing experience entry
 * Matches ExperienceUpdate DTO from backend
 */
export interface ExperienceUpdateData {
  title?: string;
  seniority_level?: SeniorityLevel | string;
  company?: string;
  location?: Address;
  start_date?: string; // ISO date string (YYYY-MM-DD)
  currently_working?: boolean;
  end_date?: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  is_volunteer?: boolean;
}

/**
 * Structure for experience response from backend
 * Matches ExperienceResponse DTO from backend - used throughout frontend
 */
export interface ExperienceResponse {
  id: string; // MongoDB ObjectId as string
  title: string;
  seniority_level: SeniorityLevel | string;
  company: string;
  location?: Address;
  start_date: string; // ISO date string
  currently_working: boolean;
  end_date?: string; // ISO date string
  description?: string;
  is_active: boolean; // Computed property from backend
  duration: string; // Computed property from backend
  is_volunteer: boolean;
}

/**
 * Frontend experience interface - same as backend for consistency
 * Used in components and resume building
 */
export interface Experience {
  id: string;
  title: string;
  seniority_level: string;
  company: string;
  city: string; // Flattened from location.city
  country: string; // Flattened from location.country
  start_date: string;
  currently_working: boolean;
  end_date: string;
  description: string;
  is_volunteer: boolean;
  duration?: string; // Optional computed field
}

/**
 * API Response wrapper structure
 */
export interface ExperienceApiResponse {
  signal: string;
  experiences?: ExperienceResponse[];
  experience?: ExperienceResponse;
}

/**
 * Error response structure
 */
export interface ExperienceApiError {
  detail: string;
  signal?: string;
} 