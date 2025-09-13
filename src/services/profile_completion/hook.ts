import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

// Types for the profile completion data
export interface ProfileCompletionData {
  user_profile: any;
  experiences: any[];
  volunteering_experiences: any[];
  educations: any[];
  technical_skills: any[];
  soft_skills: any[];
  certifications: any[];
  languages: any[];
  personal_projects: any[];
  links: any[];
  custom_sections: any[];
  completion_percentage: number;
  section_status: {
    profile_summary: boolean;
    linkedin_url: boolean;
    current_position: boolean;
    work_field: boolean;
    years_of_experience: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  stats: {
    totalExperiences: number;
    totalVolunteering: number;
    totalEducations: number;
    totalTechnicalSkills: number;
    totalSoftSkills: number;
    totalCertifications: number;
    totalLanguages: number;
    totalPersonalProjects: number;
    totalLinks: number;
    totalCustomSections: number;
  };
  is_ready_to_generate: boolean;
}

export interface ProfileCompletionResponse {
  signal: string;
  message: string;
  data: ProfileCompletionData;
}

/**
 * Hook to fetch all profile completion data in a single API call
 * This replaces multiple individual API calls for better performance
 */
export const useGetProfileCompletionData = () => {
  return useQuery<ProfileCompletionResponse>({
    queryKey: ['profile-completion-data'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/resume/profile-completion-data');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
