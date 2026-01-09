import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getJobMatcherSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="job-matcher-page"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="select-resume"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="job-details"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="match-button"]',
      placement: 'left',
    },
    {
      target: '[data-tour-id="match-results"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="match-history"]',
      placement: 'top',
    },
  ];

  return getTourSteps('job_matcher', language, stepConfigs);
};




