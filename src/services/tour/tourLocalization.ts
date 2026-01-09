import { Step } from 'react-joyride';
import enTourData from '@/locales/tour/en.json';
import arTourData from '@/locales/tour/ar.json';

export type TourScope = 
  | 'dashboard_main' 
  | 'navbar' 
  | 'my_resumes' 
  | 'job_matcher' 
  | 'cover_letter' 
  | 'evaluator';

type TourLocalizationData = {
  [key in TourScope]: {
    steps: Array<{
      title: string;
      content: string;
    }>;
  };
};

const tourData: Record<'en' | 'ar', TourLocalizationData> = {
  en: enTourData as TourLocalizationData,
  ar: arTourData as TourLocalizationData,
};

export interface TourStepConfig {
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  disableBeacon?: boolean;
}

/**
 * Maps tour scope and step index to Joyride Step objects
 * @param scope - The tour scope key
 * @param language - The language code ('en' | 'ar')
 * @param stepConfigs - Array of step configurations with target selectors
 * @returns Array of Joyride Step objects
 */
export function getTourSteps(
  scope: TourScope,
  language: 'en' | 'ar' = 'en',
  stepConfigs: TourStepConfig[]
): Step[] {
  const data = tourData[language];
  const scopeData = data[scope];

  if (!scopeData || !scopeData.steps) {
    console.warn(`No tour data found for scope: ${scope}`);
    return [];
  }

  const steps: Step[] = [];
  
  for (let index = 0; index < scopeData.steps.length; index++) {
    const stepData = scopeData.steps[index];
    const config = stepConfigs[index];
    
    if (!config) {
      console.warn(`No step config found for step ${index} in scope ${scope}`);
      continue;
    }

    steps.push({
      target: config.target,
      title: stepData.title,
      content: stepData.content,
      placement: config.placement || 'bottom',
      disableBeacon: config.disableBeacon ?? true,
    });
  }
  
  return steps;
}

/**
 * Get a single tour step by scope and index
 */
export function getTourStep(
  scope: TourScope,
  stepIndex: number,
  language: 'en' | 'ar' = 'en'
): { title: string; content: string } | null {
  const data = tourData[language];
  const scopeData = data[scope];

  if (!scopeData || !scopeData.steps || !scopeData.steps[stepIndex]) {
    return null;
  }

  return scopeData.steps[stepIndex];
}




