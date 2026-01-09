import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getNavbarSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="navbar-navigation"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="token-balance"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="theme-switcher"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="profile-menu"]',
      placement: 'bottom',
    },
  ];

  return getTourSteps('navbar', language, stepConfigs);
};




