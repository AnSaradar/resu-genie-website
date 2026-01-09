export type LanguageCode = 'en' | 'ar';

export type TourKey = 
  | 'dashboard' 
  | 'dashboard_main'
  | 'profile' 
  | 'resume' 
  | 'evaluation'
  | 'evaluator'
  | 'navbar'
  | 'my_resumes'
  | 'job_matcher'
  | 'cover_letter';

export interface TourState {
  enabled: boolean;
  completed: boolean;
  version: string;
  completed_steps?: string[];
  hidden?: boolean; // "Don't show again" flag
}

export interface UserTourPreferences {
  _id?: string;
  user_id?: string;
  language: LanguageCode;
  enabled: boolean;
  tours: Record<string, TourState> & Partial<Record<TourKey, TourState>>;
  created_at?: string;
  updated_at?: string;
}


