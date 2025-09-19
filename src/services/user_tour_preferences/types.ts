export type LanguageCode = 'en' | 'ar';

export type TourKey = 'dashboard' | 'profile' | 'resume' | 'evaluation';

export interface TourState {
  enabled: boolean;
  completed: boolean;
  version: string;
  completed_steps?: string[];
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


