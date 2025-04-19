export interface UserProfileData {
  birth_date: string; // Ensure names match API expectations (snake_case?)
  city: string;
  country: string;
  linkedin_profile?: string; // Optional fields match schema
  profile_summary?: string;
  residency: string;
  current_situation: "Employed Full-time" | "Employed Part-time" | "Freelancer" | "Student" | "Unemployed" | "Other";
  current_position?: string;
  work_field?: string;
}

// Example of a potential response type (adjust as needed)
export interface UserProfileResponse {
  id: string; // Or number, depending on your API
  message: string;
  // Potentially include the created/updated profile data
  profile?: UserProfileData; 
}
