import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createResume, exportResumePdf, exportResumeFromAccount, fetchMyResumes, getResumeDetails, renameResume, updateResume } from './service';
import { ResumeCreateRequest, ResumeExportParams, ResumeCreateResponse, ResumeListResponse, ResumeDetailsResponse, ResumeRenameRequest, ResumeRenameResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/services/auth/hook';

/**
 * Hook to create a resume (from scratch)
 */
export const useCreateResume = () => {
  return useMutation<ResumeCreateResponse, Error, ResumeCreateRequest>({
    mutationFn: createResume,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

/**
 * Hook to export a resume as PDF (returns Blob)
 */
export const useExportResumePdf = () => {
  return useMutation<Blob, Error, ResumeExportParams>({
    mutationFn: exportResumePdf,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

/**
 * Compound hook that performs create -> export -> download sequentially.
 * Useful for the "Save & Download" action.
 */
export const useGenerateAndDownloadResume = () => {
  return useMutation<unknown, Error, { createPayload: ResumeCreateRequest; templateName: string; customFileName?: string }>({
    mutationFn: async ({ createPayload, templateName, customFileName }) => {
      // Step 1: Create resume
      const createRes = await createResume(createPayload);
      const resumeId = createRes.data.resume_id;

      // Step 2: Export PDF
      const blob = await exportResumePdf({ resumeId, templateName });

      // Step 3: Trigger download in browser
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use custom filename if provided, otherwise use resume name from backend
      const fileName = customFileName 
        ? `${customFileName}.pdf`.replace(/\s+/g, '_')
        : `${createRes.data.resume_name ?? 'resume'}.pdf`.replace(/\s+/g, '_');
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    },
    // Remove automatic toast handling - let component handle it
  });
};

/**
 * Hook to retrieve current user's resumes list
 */
export const useGetMyResumes = () => {
  return useQuery<ResumeListResponse, Error>({
    queryKey: ['my-resumes'],
    queryFn: fetchMyResumes,
  });
};

/**
 * Hook to fetch details of a single resume by ID
 */
export const useGetResumeDetails = (resumeId: string, enabled = true) => {
  return useQuery<ResumeDetailsResponse, Error>({
    queryKey: ['resume-details', resumeId],
    queryFn: () => getResumeDetails(resumeId),
    enabled: !!resumeId && enabled,
  });
};

/**
 * Compound hook that performs update -> export -> download sequentially.
 * Useful for updating existing resumes and downloading them.
 */
export const useUpdateAndDownloadResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, Error, { resumeId: string; updatePayload: any; templateName: string; customFileName?: string }>({
    mutationFn: async ({ resumeId, updatePayload, templateName, customFileName }) => {
      // Step 1: Update existing resume
      const updateRes = await updateResume(resumeId, updatePayload);
      
      // Step 2: Export PDF
      const blob = await exportResumePdf({ resumeId, templateName });

      // Step 3: Trigger download in browser
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use custom filename if provided, otherwise use resume name from backend
      const fileName = customFileName 
        ? `${customFileName}.pdf`.replace(/\s+/g, '_')
        : `${updateRes.resume?.resume_name ?? 'resume'}.pdf`.replace(/\s+/g, '_');
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch resume data to show updated information
      queryClient.invalidateQueries({ queryKey: ['resume-details', variables.resumeId] });
      queryClient.invalidateQueries({ queryKey: ['my-resumes'] });
    },
    // Remove automatic toast handling - let component handle it
  });
};

/**
 * Hook to rename a resume
 */
export const useRenameResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ResumeRenameResponse, Error, { resumeId: string; payload: ResumeRenameRequest }>({
    mutationFn: ({ resumeId, payload }) => renameResume(resumeId, payload),
    onSuccess: (data, variables) => {
      // Invalidate and refetch resumes list to show updated name
      queryClient.invalidateQueries({ queryKey: ['my-resumes'] });
      
      // Show success message
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

/**
 * Hook to export resume PDF directly from account data with template selection.
 * Handles the download automatically after PDF generation.
 */
export const useExportResumeFromAccount = () => {
  const { user } = useAuth();
  
  return useMutation<unknown, Error, string>({
    mutationFn: async (templateId: string) => {
      // Step 1: Export PDF from account data
      const blob = await exportResumeFromAccount(templateId);

      // Step 2: Generate filename based on user's name
      // Format: "FirstName LastName - Resume.pdf"
      const userName = user 
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
        : 'Resume';
      const fileName = userName 
        ? `${userName} - Resume.pdf`
        : 'Resume.pdf';

      // Step 3: Trigger download in browser
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: () => {
      toast.success('Resume exported successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to export resume');
    },
  });
}; 