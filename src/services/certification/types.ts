export enum CertificateEnums {}

// Structure for creating a new certification entry
export interface CertificationData {
  name: string;
  issuing_organization: string;
  issue_date: string; // ISO date string (YYYY-MM-DD)
  certificate_url?: string;
  description?: string;
}

// Structure for updating an existing certification entry
export interface CertificationUpdateData {
  name?: string;
  issuing_organization?: string;
  issue_date?: string; // ISO date string
  certificate_url?: string;
  description?: string;
}

// Structure for certification response from backend
export interface CertificationResponse {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string; // ISO date string
  certificate_url?: string;
  description?: string;
}

// Frontend certification interface used in components
export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  certificateUrl?: string;
  description?: string;
}

// API Response wrapper structure
export interface CertificationApiResponse {
  signal: string;
  certifications?: CertificationResponse[];
  certification?: CertificationResponse;
}

export interface CertificationApiError {
  detail: string;
  signal?: string;
} 