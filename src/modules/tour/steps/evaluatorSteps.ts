import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getEvaluatorSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="evaluator-page"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="select-resume-evaluator"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="evaluate-button"]',
      placement: 'left',
    },
    {
      target: '[data-tour-id="overall-score"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="evaluation-status"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="issues-recommendations"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="general-suggestions"]',
      placement: 'top',
    },
  ];

  return getTourSteps('evaluator', language, stepConfigs);
};




