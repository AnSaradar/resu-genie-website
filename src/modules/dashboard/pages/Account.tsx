import { useEffect } from 'react';
import { AccountPersonalInfoSection } from '../components/account-sections/AccountPersonalInfoSection';
import { AccountExperienceSection } from '../components/account-sections/AccountExperienceSection';
import { AccountEducationSection } from '../components/account-sections/AccountEducationSection';
import { AccountSkillsSection } from '../components/account-sections/AccountSkillsSection';
import { AccountLanguagesSection } from '../components/account-sections/AccountLanguagesSection';
import { AccountCertificationsSection } from '../components/account-sections/AccountCertificationsSection';
import { AccountPersonalProjectsSection } from '../components/account-sections/AccountPersonalProjectsSection';
import { useTour } from '@/modules/tour/TourProvider';
import { getProfileSteps } from '@/modules/tour/steps';

export default function Account() {
  const { startTour, enabled, language } = useTour();

  // Start profile tour when component mounts
  useEffect(() => {
    if (enabled) {
      const steps = getProfileSteps(language);
      startTour({ tourKey: 'profile', steps, autoRun: true });
    }
  }, [enabled, language, startTour]);

  return (
    <div className="w-full space-y-8 py-8" data-tour="profile-nav">
      <h1 className="text-3xl font-bold mb-6">My Account Data</h1>
      
      {/* Personal Info Section */}
      <div data-tour="personal-info">
        <AccountPersonalInfoSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Experience Section */}
      <div data-tour="work-experience">
        <AccountExperienceSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Education Section */}
      <div data-tour="education">
        <AccountEducationSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Skills Section */}
      <div data-tour="skills">
        <AccountSkillsSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Languages Section */}
      <div data-tour="languages">
        <AccountLanguagesSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Certifications Section */}
      <div data-tour="certifications">
        <AccountCertificationsSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Personal Projects Section */}
      <div data-tour="personal-projects">
        <AccountPersonalProjectsSection data={null} onDataUpdate={() => {}} />
      </div>
    </div>
  );
} 