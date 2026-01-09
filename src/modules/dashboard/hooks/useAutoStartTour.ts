import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTour } from '@/modules/tour/TourProvider';
import { useUserTourPreferences } from '@/services/user_tour_preferences/hook';
import {
  getDashboardMainSteps,
  getNavbarSteps,
  getMyResumesSteps,
  getJobMatcherSteps,
  getCoverLetterSteps,
  getEvaluatorSteps,
} from '@/modules/tour/steps';

export function useAutoStartTour() {
  const location = useLocation();
  const { startTour, enabled, language } = useTour();
  const { prefs, loading } = useUserTourPreferences();

  useEffect(() => {
    if (loading || !prefs || !enabled) return;

    const path = location.pathname;
    let tourKey: string | null = null;
    let steps: any[] = [];

    // Determine which tour to start based on route
    if (path === '/dashboard' || path === '/dashboard/') {
      tourKey = 'dashboard_main';
      steps = getDashboardMainSteps(language);
    } else if (path === '/dashboard/resumes') {
      tourKey = 'my_resumes';
      steps = getMyResumesSteps(language);
    } else if (path === '/dashboard/job-matcher') {
      tourKey = 'job_matcher';
      steps = getJobMatcherSteps(language);
    } else if (path === '/dashboard/cover-letter') {
      tourKey = 'cover_letter';
      steps = getCoverLetterSteps(language);
    } else if (path === '/dashboard/evaluator') {
      tourKey = 'evaluator';
      steps = getEvaluatorSteps(language);
    }

    // Check if tour should be started
    if (tourKey && steps.length > 0) {
      const tourState = prefs.tours?.[tourKey];
      // Don't show if completed OR hidden
      const shouldSkip = tourState?.completed === true || tourState?.hidden === true;
      
      console.log(`[Tour] Checking tour ${tourKey}:`, {
        tourState,
        hidden: tourState?.hidden,
        completed: tourState?.completed,
        shouldSkip,
        shouldStart: !shouldSkip
      });
      
      // Only start if not completed and not hidden
      if (!shouldSkip) {
        console.log(`[Tour] Starting tour ${tourKey} with ${steps.length} steps`);
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAutoStartTour.ts:before_start',message:'auto_start_attempt',data:{path, tourKey, stepsCount:steps.length, firstTarget:steps[0]?.target ?? null, firstTargetFound:steps[0]?.target ? !!document.querySelector(steps[0].target) : null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4'})}).catch(()=>{});
          // #endregion
          startTour({ tourKey, steps, autoRun: true });
        }, 500);
        return () => clearTimeout(timer);
      } else {
        console.log(`[Tour] Skipping tour ${tourKey} - completed: ${tourState?.completed}, hidden: ${tourState?.hidden}`);
      }
    }
  }, [location.pathname, prefs, loading, enabled, language, startTour]);
}




