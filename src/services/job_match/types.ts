export interface MatchedSkill {
  name: string;
  present_in_resume: boolean;
  confidence?: number | null;
}

export interface GapRecommendation {
  requirement: string;
  advice: string;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface JobMatchRequest {
  resume_id: string;
  job_offer_text: string;
  job_title?: string;
  llm_model?: string;
}

export interface JobMatch {
  _id: string;
  user_id: string;
  resume_id: string;
  job_title?: string;
  overall_score?: number;
  skills_score?: number;
  experience_score?: number;
  education_score?: number;
  matched_skills: MatchedSkill[];
  missing_core_requirements: string[];
  recommendations: GapRecommendation[];
  llm_model?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobMatchResponse {
  signal: string;
  job_match: JobMatch;
}

export interface JobMatchHistoryResponse {
  signal: string;
  items: JobMatch[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}


