export enum CoverLetterTone {
  PROFESSIONAL = "professional",
  CREATIVE = "creative",
  ENTHUSIASTIC = "enthusiastic",
  CONFIDENT = "confident",
  FRIENDLY = "friendly",
  FORMAL = "formal",
}

// Helper function to convert string to enum (case-insensitive)
export const stringToCoverLetterTone = (value: string): CoverLetterTone => {
  const upperValue = value.toUpperCase();
  switch (upperValue) {
    case 'PROFESSIONAL':
      return CoverLetterTone.PROFESSIONAL;
    case 'CREATIVE':
      return CoverLetterTone.CREATIVE;
    case 'ENTHUSIASTIC':
      return CoverLetterTone.ENTHUSIASTIC;
    case 'CONFIDENT':
      return CoverLetterTone.CONFIDENT;
    case 'FRIENDLY':
      return CoverLetterTone.FRIENDLY;
    case 'FORMAL':
      return CoverLetterTone.FORMAL;
    default:
      return CoverLetterTone.PROFESSIONAL;
  }
};

export interface CoverLetterRequest {
  resume_id?: string;
  job_title: string;
  job_description: string;
  company_name?: string;
  hiring_manager_name?: string;
  tone?: CoverLetterTone;
  llm_model?: string;
}

export interface CoverLetter {
  _id: string;
  user_id: string;
  resume_id?: string;
  job_title: string;
  job_description: string;
  company_name?: string;
  hiring_manager_name?: string;
  tone?: CoverLetterTone;
  cover_letter_content: string;
  llm_model?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCoverLetterResponse {
  signal: string;
  message: string;
  cover_letter: CoverLetter;
}

export interface CoverLetterHistoryResponse {
  signal: string;
  message: string;
  items: CoverLetter[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface GetCoverLetterResponse {
  signal: string;
  message: string;
  cover_letter: CoverLetter;
}
