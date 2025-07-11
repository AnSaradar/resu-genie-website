import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  addSkills,
  updateSkill,
  deleteSkill,
  getAllSkills,
  getSkill,
  flattenSkill,
  prepareSkillData,
} from './service';
import { Skill, SkillData, SkillUpdateData, SkillResponse } from './types';

/**
 * Get all skills of authenticated user
 */
export const useGetAllSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getAllSkills,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: SkillResponse[]) => data.map(flattenSkill),
  });
};

/**
 * Get single skill by id
 */
export const useGetSkill = (skillId: string) => {
  return useQuery({
    queryKey: ['skill', skillId],
    queryFn: () => getSkill(skillId),
    enabled: !!skillId,
    select: flattenSkill,
  });
};

/**
 * Add multiple skills
 */
export const useAddSkills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skills: Skill[]) => {
      const apiData: SkillData[] = skills.map(prepareSkillData);
      return addSkills(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success(`Successfully added ${data.length} skill${data.length !== 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add skills');
    },
  });
};

/**
 * Update single skill
 */
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, updateData }: { skillId: string; updateData: SkillUpdateData }) =>
      updateSkill(skillId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update skill');
    },
  });
};

/**
 * Delete skill
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete skill');
    },
  });
}; 