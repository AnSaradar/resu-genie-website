import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserTourPreferences, TourKey, TourState, LanguageCode } from './types';
import { getUserTourPreferences, updateUserTourPreferences, updateTourState, setTourLanguage } from './service';

export function useUserTourPreferences() {
  const [prefs, setPrefs] = useState<UserTourPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrefs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching tour preferences...');
      const data = await getUserTourPreferences();
      console.log('✅ Tour preferences fetched:', data);
      setPrefs(data);
    } catch (e: any) {
      console.error('❌ Failed to fetch tour preferences:', e);
      setError(e?.message || 'Failed to fetch tour preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrefs();
  }, [fetchPrefs]);

  const setEnabled = useCallback(async (enabled: boolean) => {
    const next = await updateUserTourPreferences({ enabled });
    setPrefs(next);
  }, []);

  const setLanguage = useCallback(async (language: LanguageCode) => {
    const next = await setTourLanguage(language);
    setPrefs(next);
  }, []);

  const setTour = useCallback(async (tourKey: TourKey | string, state: Partial<TourState>) => {
    const next = await updateTourState(tourKey, state);
    setPrefs(next);
  }, []);

  const value = useMemo(() => ({ prefs, loading, error, refetch: fetchPrefs, setEnabled, setLanguage, setTour }), [prefs, loading, error, fetchPrefs, setEnabled, setLanguage, setTour]);

  return value;
}


