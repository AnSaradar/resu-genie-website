import apiClient from '@/lib/axios';
import {
  SkillApiResponse,
  SkillResponse,
  SkillData,
  SkillUpdateData,
  Skill,
  SkillProficiency,
} from './types';

/**
 * Mapping helpers between backend proficiency and UI numeric level
 */
const proficiencyToLevelMap: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
  Master: 5,
};

const levelToProficiencyMap: Record<number, SkillProficiency> = {
  1: SkillProficiency.BEGINNER,
  2: SkillProficiency.INTERMEDIATE,
  3: SkillProficiency.ADVANCED,
  4: SkillProficiency.EXPERT,
  5: SkillProficiency.MASTER,
};

/**
 * Convert API SkillResponse to UI Skill interface
 */
export const flattenSkill = (skill: SkillResponse): Skill => {
  return {
    id: skill.id,
    name: skill.name,
    is_soft_skill: skill.is_soft_skill,
    level: proficiencyToLevelMap[skill.proficiency ?? 'Beginner'] ?? 1,
  };
};

/**
 * Prepare UI Skill for API payload
 */
export const prepareSkillData = (skill: Skill): SkillData => {
  return {
    name: skill.name,
    proficiency: levelToProficiencyMap[skill.level],
    is_soft_skill: skill.is_soft_skill,
  };
};

/** **************************
 *        API Methods        *
 *****************************/

// Add multiple skills for the authenticated user
export const addSkills = async (skills: SkillData[]): Promise<SkillResponse[]> => {
  const response = await apiClient.post<SkillApiResponse>('/api/v1/skill/', skills);
  return response.data.skills || [];
};

// Update a specific skill
export const updateSkill = async (skillId: string, updateData: SkillUpdateData): Promise<SkillResponse> => {
  const response = await apiClient.put<SkillApiResponse>(`/api/v1/skill/${skillId}`, updateData);
  return response.data.skill!;
};

// Delete a specific skill
export const deleteSkill = async (skillId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/skill/${skillId}`);
};

// Get all skills for the authenticated user
export const getAllSkills = async (): Promise<SkillResponse[]> => {
  const response = await apiClient.get<SkillApiResponse>('/api/v1/skill/');
  return response.data.skills || [];
};

// Get a single skill by id
export const getSkill = async (skillId: string): Promise<SkillResponse> => {
  const response = await apiClient.get<SkillApiResponse>(`/api/v1/skill/${skillId}`);
  return response.data.skill!;
}; 