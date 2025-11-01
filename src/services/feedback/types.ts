export type FeedbackFeature = "cover_letter" | "job_match";
export type FeedbackRating = 1 | -1;

export interface FeedbackRequest {
  artifact_id?: string;
  trace_id?: string;
  feature: FeedbackFeature;
  rating: FeedbackRating;
  tags?: string[];
  note?: string;
  input_snapshot?: Record<string, any>;
  output_snapshot_text?: string;
  output_snapshot_json?: Record<string, any>;
  ui_version?: string;
}

export interface FeedbackResponse {
  ok: boolean;
  updated: boolean;
  feedback_id: string;
  trace_id?: string;
  artifact_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackTagsResponse {
  cover_letter: string[];
  job_match: string[];
}

// Tag definitions for each feature
export const COVER_LETTER_TAGS = [
  "tone",
  "personalization",
  "specificity",
  "grammar",
  "length",
  "too_generic",
  "structure",
  "formatting",
  "examples",
  "company_mismatch",
] as const;

export const JOB_MATCH_TAGS = [
  "score_unfair",
  "missed_skills",
  "degree_requirement",
  "years_experience",
  "keyword_coverage",
  "hallucination",
  "explanation_clarity",
] as const;

export type CoverLetterTag = typeof COVER_LETTER_TAGS[number];
export type JobMatchTag = typeof JOB_MATCH_TAGS[number];

// Helper to get display names for tags
export const TAG_DISPLAY_NAMES: Record<string, string> = {
  // Cover Letter tags
  tone: "Tone",
  personalization: "Personalization",
  specificity: "Specificity",
  grammar: "Grammar",
  length: "Length",
  too_generic: "Too Generic",
  structure: "Structure",
  formatting: "Formatting",
  examples: "Examples",
  company_mismatch: "Company Mismatch",
  
  // Job Match tags
  score_unfair: "Score Unfair",
  missed_skills: "Missed Skills",
  degree_requirement: "Degree Requirement",
  years_experience: "Years Experience",
  keyword_coverage: "Keyword Coverage",
  hallucination: "Hallucination",
  explanation_clarity: "Explanation Clarity",
};

