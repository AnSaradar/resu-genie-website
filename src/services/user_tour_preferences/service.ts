import apiClient from '@/lib/axios';
import { UserTourPreferences, TourKey, TourState, LanguageCode } from './types';
import { handleServiceError } from '@/utils/error-utils';

export async function getUserTourPreferences(): Promise<UserTourPreferences> {
  try {
    console.log('🌐 Making API call to get tour preferences...');
    const { data } = await apiClient.get('/api/v1/user_tour_preferences/');
    console.log('✅ API response received:', data);
    return data as UserTourPreferences;
  } catch (error: any) {
    console.error('❌ API call failed:', error);
    throw handleServiceError(error, 'api.fetch_failed', 'tour_preferences');
  }
}

export async function updateUserTourPreferences(payload: Partial<UserTourPreferences>): Promise<UserTourPreferences> {
  try {
    const { data } = await apiClient.put('/api/v1/user_tour_preferences/', payload);
    return data as UserTourPreferences;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'tour_preferences');
  }
}

export async function updateTourState(tourKey: TourKey | string, payload: Partial<TourState>): Promise<UserTourPreferences> {
  try {
    const { data } = await apiClient.patch(`/api/v1/user_tour_preferences/tours/${tourKey}`, payload);
    return data as UserTourPreferences;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'tour_preferences');
  }
}

export async function setTourLanguage(language: LanguageCode): Promise<UserTourPreferences> {
  try {
    const { data } = await apiClient.patch('/api/v1/user_tour_preferences/language', { language });
    return data as UserTourPreferences;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'tour_preferences');
  }
}


