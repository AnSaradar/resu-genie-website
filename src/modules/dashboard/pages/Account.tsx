import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/axios';
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startTour, enabled, language } = useTour();

  // Fetch all account data
  const fetchData = () => {
    setLoading(true);
    apiClient.get('/api/v1/account-data/complete')
      .then(res => {
        setData(res.data.data);
        setError(null);
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Failed to load account data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Start profile tour when data is loaded
  useEffect(() => {
    if (enabled && data) {
      const steps = getProfileSteps(language);
      startTour({ tourKey: 'profile', steps, autoRun: true });
    }
  }, [enabled, language, data, startTour]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <div className="text-lg font-bold mb-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-8" data-tour="profile-nav">
      <h1 className="text-3xl font-bold mb-6">My Account Data</h1>
      
      {/* Personal Info Section */}
      <div data-tour="personal-info">
        <AccountPersonalInfoSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Experience Section */}
      <div data-tour="work-experience">
        <AccountExperienceSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Education Section */}
      <div data-tour="education">
        <AccountEducationSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Skills Section */}
      <div data-tour="skills">
        <AccountSkillsSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Languages Section */}
      <div data-tour="languages">
        <AccountLanguagesSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Certifications Section */}
      <div data-tour="certifications">
        <AccountCertificationsSection data={data} onDataUpdate={fetchData} />
      </div>
      
      {/* Personal Projects Section */}
      <div data-tour="personal-projects">
        <AccountPersonalProjectsSection data={data} onDataUpdate={fetchData} />
      </div>
    </div>
  );
} 