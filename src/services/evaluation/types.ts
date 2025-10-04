// Evaluation API Types - matches backend DTOs

// New Unified Evaluation Types (Primary)
export interface MistakeIssue {
  issue: string;
  priority: 'good' | 'warning' | 'critical';
  section: 'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'languages' | 'certificates' | 'links' | 'custom_sections';
}

export interface UnifiedEvaluationResponse {
  score: number; // 1-10
  status: 'good' | 'warning' | 'critical';
  message: string;
  suggestions: string[];
  mistakes_issues: MistakeIssue[];
}

export interface SectionFeedback {
  status: 'good' | 'warning' | 'critical';
  message: string;
  suggestions: string[];
}

export interface ComprehensiveEvaluationResponse {
  overall_score: number; // 1-10
  overall_status: 'good' | 'warning' | 'critical';
  overall_message: string;
  section_scores: {
    personal_info: number;
    experience: number;
    education: number;
    technical_skills: number;
    soft_skills: number;
    certifications: number;
    languages: number;
    personal_links: number;
    personal_projects: number;
    custom_sections: number;
  };
  section_feedback: {
    personal_info: SectionFeedback;
    experience: SectionFeedback;
    education: SectionFeedback;
    technical_skills: SectionFeedback;
    soft_skills: SectionFeedback;
    certifications: SectionFeedback;
    languages: SectionFeedback;
    personal_links: SectionFeedback;
    personal_projects: SectionFeedback;
    custom_sections: SectionFeedback;
  };
  cross_section_insights: string[];
  top_priority_actions: string[];
}

// Legacy Types (for backward compatibility)
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

// Request types
export interface EvaluateRequest {
  resume_id?: string | null;
}

// UI State types
export interface EvaluationState {
  isLoading: boolean;
  error: string | null;
  currentEvaluation: UnifiedEvaluationResponse | null;
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

// Status interpretation helpers for new comprehensive evaluation
export const getStatusColor = (status: 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'good': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getStatusLabel = (status: 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'good': return 'Good';
    case 'warning': return 'Warning';
    case 'critical': return 'Critical';
    default: return 'Unknown';
  }
};

export const getStatusBadgeVariant = (status: 'good' | 'warning' | 'critical'): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'good': return 'default';
    case 'warning': return 'secondary';
    case 'critical': return 'destructive';
    default: return 'outline';
  }
};

// Section mapping for display
export const SECTION_DISPLAY_CONFIG = {
  profile: {
    title: 'Profile',
    icon: 'User',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  experience: {
    title: 'Experience',
    icon: 'Briefcase',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  education: {
    title: 'Education',
    icon: 'GraduationCap',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  skills: {
    title: 'Skills',
    icon: 'Code',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  projects: {
    title: 'Projects',
    icon: 'FolderOpen',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
  },
  languages: {
    title: 'Languages',
    icon: 'Globe',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20'
  },
  certificates: {
    title: 'Certificates',
    icon: 'Award',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  links: {
    title: 'Links',
    icon: 'Link',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
  custom_sections: {
    title: 'Custom Sections',
    icon: 'FileText',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
  }
} as const;
