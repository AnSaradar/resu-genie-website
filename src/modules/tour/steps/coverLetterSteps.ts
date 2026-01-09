import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getCoverLetterSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="cover-letter-page"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="select-resume-cover"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="job-information"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="tone-selection"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="generate-button"]',
      placement: 'left',
    },
    {
      target: '[data-tour-id="generated-letter"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="letter-history"]',
      placement: 'top',
    },
  ];

  return getTourSteps('cover_letter', language, stepConfigs);
};




