// Degree types from backend enum
export enum Degree {
  HIGH_SCHOOL = "High School",
  ASSOCIATE = "Associate",
  BACHELOR = "Bachelor",
  MASTER = "Master",
  PHD = "PhD",
  DIPLOMA = "Diploma",
  OTHER = "Other"
}

/**
 * Structure for creating a new education entry
 * Matches EducationCreate DTO from backend
 */
export interface EducationData {
  institution: string;
  degree: Degree | string;
  field: string;
  start_date: string; // ISO date string (YYYY-MM-DD)
  currently_studying: boolean;
  end_date?: string; // ISO date string (YYYY-MM-DD), optional if currently_studying is true
  description?: string;
}

/**
 * Structure for updating an existing education entry
 * Matches EducationUpdate DTO from backend
 */
export interface EducationUpdateData {
  institution?: string;
  degree?: Degree | string;
  field?: string;
  start_date?: string; // ISO date string (YYYY-MM-DD)
  currently_studying?: boolean;
  end_date?: string; // ISO date string (YYYY-MM-DD)
  description?: string;
}

/**
 * Structure for education response from backend
 * Matches EducationResponse DTO from backend
 */
export interface EducationResponse {
  id: string; // MongoDB ObjectId as string
  institution: string;
  degree: Degree | string;
  field: string;
  start_date: string; // ISO date string
  currently_studying: boolean;
  end_date?: string; // ISO date string
  description?: string;
  duration: string; // Computed property from backend
}

/**
 * Frontend education interface - same as backend for consistency
 * Used in components and resume building
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  currently_studying: boolean;
  end_date: string;
  description: string;
  duration?: string; // Optional computed field
}

/**
 * API Response wrapper structure
 */
export interface EducationApiResponse {
  signal: string;
  educations?: EducationResponse[];
  education?: EducationResponse;
}

/**
 * Error response structure
 */
export interface EducationApiError {
  detail: string;
  signal?: string;
} 