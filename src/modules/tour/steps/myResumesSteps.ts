import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getMyResumesSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="my-resumes-page"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="create-resume-button"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="resume-list"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="resume-actions"]',
      placement: 'top',
    },
  ];

  return getTourSteps('my_resumes', language, stepConfigs);
};




