// Address structure matching backend
export interface Address {
  city?: string; // Optional city
  country: string; // Required country
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

// Work fields from backend enum
export enum WorkField {
  SOFTWARE_DEVELOPMENT = "Software Development",
  DATA_SCIENCE = "Data Science",
  WEB_DEVELOPMENT = "Web Development",
  MOBILE_DEVELOPMENT = "Mobile Development",
  CLOUD_COMPUTING = "Cloud Computing",
  DEVOPS = "DevOps",
  CYBERSECURITY = "Cybersecurity",
  UI_UX_DESIGN = "UI/UX Design",
  PRODUCT_MANAGEMENT = "Product Management",
  PROJECT_MANAGEMENT = "Project Management",
  DIGITAL_MARKETING = "Digital Marketing",
  CONTENT_CREATION = "Content Creation",
  CUSTOMER_SERVICE = "Customer Service",
  SALES = "Sales",
  FINANCE = "Finance",
  HR = "Human Resources",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  RESEARCH = "Research",
  LEGAL = "Legal",
  OTHER = "Other"
}

// User profile data structure matching backend DTO exactly
export interface UserProfileData {
  linkedin_url?: string; // Optional LinkedIn profile URL
  website_url?: string; // Optional personal website URL
  birth_date: string; // Date of birth (will be sent as ISO string)
  profile_summary?: string; // Optional summary/bio
  address?: Address; // Optional physical address
  country_of_residence?: string; // Optional country of residence
  current_position?: string; // Optional current job title
  current_seniority_level?: SeniorityLevel; // Optional current seniority level
  work_field?: WorkField; // Optional primary field of work
  years_of_experience?: number; // Optional years of professional experience (0-50)
}

// Response structure from backend
export interface UserProfileResponse {
  linkedin_url?: string;
  website_url?: string;
  birth_date: string;
  profile_summary?: string;
  address?: Address;
  country_of_residence?: string;
  current_position?: string;
  current_seniority_level?: SeniorityLevel;
  work_field?: WorkField;
  years_of_experience?: number;
}

export interface ProfileExistsResponse {
  profile_exists: boolean;
  signal?: string;
  message?: string;
}
