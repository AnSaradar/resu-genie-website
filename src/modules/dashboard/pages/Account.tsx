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

export default function Account() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full space-y-8 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account Data</h1>
      
      {/* Personal Info Section */}
      <AccountPersonalInfoSection data={data} onDataUpdate={fetchData} />
      
      {/* Experience Section */}
      <AccountExperienceSection data={data} onDataUpdate={fetchData} />
      
      {/* Education Section */}
      <AccountEducationSection data={data} onDataUpdate={fetchData} />
      
      {/* Skills Section */}
      <AccountSkillsSection data={data} onDataUpdate={fetchData} />
      
      {/* Languages Section */}
      <AccountLanguagesSection data={data} onDataUpdate={fetchData} />
      
      {/* Certifications Section */}
      <AccountCertificationsSection data={data} onDataUpdate={fetchData} />
      
      {/* Personal Projects Section */}
      <AccountPersonalProjectsSection data={data} onDataUpdate={fetchData} />
    </div>
  );
} 