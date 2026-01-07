export interface DashboardStats {
  total_resumes: number;
  total_job_matches: number;
  total_cover_letters: number;
  total_experiences: number;
  total_educations: number;
  total_skills: number;
  total_certifications: number;
}

export interface DashboardStatsResponse {
  signal: string;
  message: string;
  data: DashboardStats;
}

