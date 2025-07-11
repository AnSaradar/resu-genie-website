import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  addCertifications,
  updateCertification,
  deleteCertification,
  getAllCertifications,
  flattenCertification,
  prepareCertificationData
} from './service';
import {
  Certification,
  CertificationResponse,
  CertificationUpdateData
} from './types';

/**
 * Hook to fetch all certifications for the authenticated user
 */
export const useGetAllCertifications = () => {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: getAllCertifications,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    select: (data: CertificationResponse[]) => data.map(flattenCertification)
  });
};

/**
 * Hook to add multiple certifications
 */
export const useAddCertifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certs: Certification[]) => {
      const apiData = certs.map(prepareCertificationData);
      return addCertifications(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success(`Successfully added ${data.length} certification${data.length > 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding certifications:', error);
      toast.error(error.message || 'Failed to add certifications');
    }
  });
};

/**
 * Hook to update a certification
 */
export const useUpdateCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ certId, updateData }: { certId: string; updateData: CertificationUpdateData }) => {
      return updateCertification(certId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating certification:', error);
      toast.error(error.message || 'Failed to update certification');
    }
  });
};

/**
 * Hook to delete a certification
 */
export const useDeleteCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting certification:', error);
      toast.error(error.message || 'Failed to delete certification');
    }
  });
}; 