import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createResume, exportResumePdf, fetchMyResumes, getResumeDetails } from './service';
import { ResumeCreateRequest, ResumeExportParams, ResumeCreateResponse, ResumeListResponse, ResumeDetailsResponse } from './types';
import { useQuery } from '@tanstack/react-query';

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
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Resume generated and downloaded successfully!');
    },
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