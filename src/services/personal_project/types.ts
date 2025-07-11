export interface PersonalProjectData {
  title: string;
  description: string;
  technologies?: string[];
  start_date?: string; // ISO date
  end_date?: string; // ISO date
  is_ongoing: boolean;
  live_url?: string;
  project_url?: string;
}

export interface PersonalProjectUpdateData {
  title?: string;
  description?: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  live_url?: string;
  project_url?: string;
}

export interface PersonalProjectResponse {
  id: string; // MongoDB ObjectId
  title: string;
  description: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing: boolean;
  live_url?: string;
  project_url?: string;
  duration?: string;
}

export interface PersonalProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  liveUrl?: string;
  projectUrl?: string;
  achievements?: string;
  duration?: string;
}

export interface PersonalProjectApiResponse {
  signal: string;
  personal_projects?: PersonalProjectResponse[];
  personal_project?: PersonalProjectResponse;
} 