import { Step } from 'react-joyride';
import { getTourSteps, TourStepConfig } from '@/services/tour/tourLocalization';

export const getDashboardMainSteps = (language: 'en' | 'ar'): Step[] => {
  const stepConfigs: TourStepConfig[] = [
    {
      target: '[data-tour-id="dashboard-welcome"]',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="profile-widget"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="platform-features"]',
      placement: 'bottom',
    },
    {
      target: '[data-tour-id="quick-actions"]',
      placement: 'top',
    },
    {
      target: '[data-tour-id="recent-activity"]',
      placement: 'top',
    },
  ];

  return getTourSteps('dashboard_main', language, stepConfigs);
};




