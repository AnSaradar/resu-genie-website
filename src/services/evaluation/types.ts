// Evaluation API Types - matches backend DTOs

export interface EvaluationResponse {
  evaluation_area: 'user_profile' | 'experience' | 'education';
  score: number; // 1-10
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  message: string;
  suggestions: string[];
}

export interface CompleteEvaluationResponse {
  overall_score: number;
  user_profile_evaluation: EvaluationResponse;
  experience_evaluation: EvaluationResponse;
  education_evaluation: EvaluationResponse;
  overall_suggestions: string[];
}

// API Response wrappers
export interface EvaluationApiResponse<T> {
  signal: string;
  evaluation: T;
}

export interface EvaluationHistoryResponse {
  signal: string;
  evaluations: EvaluationHistoryItem[];
}

export interface EvaluationHistoryItem {
  _id: string;
  user_id: string;
  evaluation_area: 'user_profile' | 'experience' | 'education' | 'complete';
  score: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  message: string;
  suggestions: string[];
  created_at: string;
  updated_at: string;
}

// Request types
export interface EvaluateResumeRequest {
  resumeId: string;
  evaluationType: 'complete' | 'user_profile' | 'experience' | 'education';
}

export interface EvaluateProfileRequest {
  evaluationType: 'complete' | 'user_profile' | 'experience' | 'education';
}

// UI State types
export interface EvaluationState {
  isLoading: boolean;
  error: string | null;
  currentEvaluation: CompleteEvaluationResponse | null;
  evaluationHistory: EvaluationHistoryItem[];
  selectedResumeId: string | null;
}

// Score interpretation helpers
export const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Needs Improvement';
  return 'Poor';
};

export const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (score >= 8) return 'default';
  if (score >= 6) return 'secondary';
  if (score >= 4) return 'outline';
  return 'destructive';
};
