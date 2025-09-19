import apiClient from '@/lib/axios';
import { UserTourPreferences, TourKey, TourState, LanguageCode } from './types';

export async function getUserTourPreferences(): Promise<UserTourPreferences> {
  try {
    console.log('🌐 Making API call to get tour preferences...');
    const { data } = await apiClient.get('/api/v1/user_tour_preferences/');
    console.log('✅ API response received:', data);
    return data as UserTourPreferences;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
}

export async function updateUserTourPreferences(payload: Partial<UserTourPreferences>): Promise<UserTourPreferences> {
  const { data } = await apiClient.put('/api/v1/user_tour_preferences/', payload);
  return data as UserTourPreferences;
}

export async function updateTourState(tourKey: TourKey | string, payload: Partial<TourState>): Promise<UserTourPreferences> {
  const { data } = await apiClient.patch(`/api/v1/user_tour_preferences/tours/${tourKey}`, payload);
  return data as UserTourPreferences;
}

export async function setTourLanguage(language: LanguageCode): Promise<UserTourPreferences> {
  const { data } = await apiClient.patch('/api/v1/user_tour_preferences/language', { language });
  return data as UserTourPreferences;
}


