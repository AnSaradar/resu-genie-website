export interface ResumeCreateRequest {
  resume_name?: string;
  personal_info: Record<string, any>; // TODO: Replace `any` with strongly typed PersonalInfo interface
  career_experiences?: any[];
  volunteering_experiences?: any[];
  education?: any[];
  technical_skills?: any[];
  soft_skills?: any[];
  certifications?: any[];
  languages?: any[];
  personal_projects?: any[];
  personal_links?: any[];
  custom_sections?: any[];
}

export interface ResumeCreateResponse {
  signal: string;
  message: string;
  data: {
    resume_id: string;
    resume_name: string;
    created_at?: string;
  };
  warnings?: string[];
}

export interface ResumeExportParams {
  resumeId: string;
  templateName: string; // should match backend TemplateEnum value e.g. "moey_template.html"
}

// --- List Resumes ---
export interface ResumeListItem {
  id: string;
  resume_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResumeListResponse {
  signal: string;
  message: string;
  data: {
    resumes: ResumeListItem[];
    total_count: number;
  };
}

// --- Single Resume Details ---
export interface ResumeDetailsResponse {
  signal: string;
  message: string;
  resume: any; // TODO: Strongly type this to match backend Resume schema
}

// --- Rename Resume ---
export interface ResumeRenameRequest {
  new_name: string;
}

export interface ResumeRenameResponse {
  signal: string;
  message: string;
  data: {
    resume_id: string;
    resume_name: string;
    updated_at?: string;
  };
} 