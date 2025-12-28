import { useEffect, useState } from 'react';
import { AccountPersonalInfoSection } from '../components/account-sections/AccountPersonalInfoSection';
import { AccountExperienceSection } from '../components/account-sections/AccountExperienceSection';
import { AccountEducationSection } from '../components/account-sections/AccountEducationSection';
import { AccountSkillsSection } from '../components/account-sections/AccountSkillsSection';
import { AccountLanguagesSection } from '../components/account-sections/AccountLanguagesSection';
import { AccountCertificationsSection } from '../components/account-sections/AccountCertificationsSection';
import { AccountLinksSection } from '../components/account-sections/AccountLinksSection';
import { AccountPersonalProjectsSection } from '../components/account-sections/AccountPersonalProjectsSection';
import { ExportResumeDialog } from '../components/account-sections/ExportResumeDialog';
import { useTour } from '@/modules/tour/TourProvider';
import { getProfileSteps } from '@/modules/tour/steps';
import { useExportResumeFromAccount } from '@/services/resume/hook';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Account() {
  const { startTour, enabled, language } = useTour();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const exportResumeMutation = useExportResumeFromAccount();

  // Start profile tour when component mounts
  useEffect(() => {
    if (enabled) {
      const steps = getProfileSteps(language);
      startTour({ tourKey: 'profile', steps, autoRun: true });
    }
  }, [enabled, language, startTour]);

  const handleExport = async (templateId: string) => {
    try {
      await exportResumeMutation.mutateAsync(templateId);
      // Close dialog after successful export
      setIsExportDialogOpen(false);
    } catch (error) {
      // Error is already handled by the hook (toast)
      // Dialog stays open so user can try again
    }
  };

  return (
    <div className="w-full space-y-8 py-8" data-tour="profile-nav">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Account Data</h1>
        <Button
          onClick={() => setIsExportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Resume / CV
        </Button>
      </div>
      
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
      
      {/* Links Section */}
      <div data-tour="links">
        <AccountLinksSection data={null} onDataUpdate={() => {}} />
      </div>
      
      {/* Personal Projects Section */}
      <div data-tour="personal-projects">
        <AccountPersonalProjectsSection data={null} onDataUpdate={() => {}} />
      </div>

      {/* Export Resume Dialog */}
      <ExportResumeDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExport}
        isExporting={exportResumeMutation.isPending}
      />
    </div>
  );
} 