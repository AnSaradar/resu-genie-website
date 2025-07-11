export enum SkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
  MASTER = "Master",
}

// Data for creating a new skill entry (matches SkillCreate DTO)
export interface SkillData {
  name: string;
  proficiency?: SkillProficiency | string;
  is_soft_skill: boolean;
}

// Data for updating an existing skill entry (matches SkillUpdate DTO)
export interface SkillUpdateData {
  name?: string;
  proficiency?: SkillProficiency | string;
  is_soft_skill?: boolean;
}

// Response structure for a skill entry from backend (matches SkillResponse DTO)
export interface SkillResponse {
  id: string; // MongoDB ObjectId as string
  name: string;
  proficiency?: SkillProficiency | string;
  is_soft_skill: boolean;
}

// Front-end skill interface used in Resume Builder UI
export interface Skill {
  id: string;
  name: string;
  is_soft_skill: boolean; // true => Soft Skill, false => Career Skill
  level: number; // 1-5 numeric proficiency used for star rating UI
}

// Generic API wrapper returned by backend
export interface SkillApiResponse {
  signal: string;
  skills?: SkillResponse[];
  skill?: SkillResponse;
} 