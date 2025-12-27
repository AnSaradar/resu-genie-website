export interface PersonalProjectData {
  title: string;
  description: string;
  technologies?: string[];
  start_date?: string; // ISO date
  end_date?: string; // ISO date
  is_ongoing: boolean;
  url?: string; // Live URL - matches backend field name
  repository_url?: string; // Repository URL - matches backend field name
}

export interface PersonalProjectUpdateData {
  title?: string;
  description?: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  url?: string; // Live URL - matches backend field name
  repository_url?: string; // Repository URL - matches backend field name
}

export interface PersonalProjectResponse {
  id: string; // MongoDB ObjectId
  title: string;
  description: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing: boolean;
  url?: string; // Live URL - matches backend field name
  repository_url?: string; // Repository URL - matches backend field name
  duration?: string;
}

export interface PersonalProject {
  id: string;
  title: string; // Changed from 'name' to match backend
  description: string;
  technologies: string[];
  startDate?: string; // Made optional
  endDate?: string; // Made optional
  isOngoing: boolean;
  liveUrl?: string;
  projectUrl?: string;
  // Removed 'achievements' field as it's not supported by backend
  duration?: string;
}

export interface PersonalProjectApiResponse {
  signal: string;
  personal_projects?: PersonalProjectResponse[];
  personal_project?: PersonalProjectResponse;
} 