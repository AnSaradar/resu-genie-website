import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  addLinks,
  updateLink,
  deleteLink,
  getAllLinks,
  flattenLink,
  prepareLinkData
} from './service';
import {
  Link,
  LinkResponse,
  LinkUpdateData
} from './types';

/**
 * Hook to fetch all links for the authenticated user
 */
export const useGetAllLinks = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: getAllLinks,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    select: (data: LinkResponse[]) => data.map(flattenLink)
  });
};

/**
 * Hook to add multiple links
 */
export const useAddLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (links: Link[]) => {
      const apiData = links.map(prepareLinkData);
      return addLinks(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success(`Successfully added ${data.length} link${data.length > 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding links:', error);
      toast.error(error.message || 'Failed to add links');
    }
  });
};

/**
 * Hook to update a link
 */
export const useUpdateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, updateData }: { linkId: string; updateData: LinkUpdateData }) => {
      return updateLink(linkId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating link:', error);
      toast.error(error.message || 'Failed to update link');
    }
  });
};

/**
 * Hook to delete a link
 */
export const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting link:', error);
      toast.error(error.message || 'Failed to delete link');
    }
  });
};

