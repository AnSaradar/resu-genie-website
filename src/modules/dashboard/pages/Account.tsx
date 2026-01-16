import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AccountPersonalInfoSection } from '../components/account-sections/AccountPersonalInfoSection';
import { AccountExperienceSection } from '../components/account-sections/AccountExperienceSection';
import { AccountEducationSection } from '../components/account-sections/AccountEducationSection';
import { AccountSkillsSection } from '../components/account-sections/AccountSkillsSection';
import { AccountLanguagesSection } from '../components/account-sections/AccountLanguagesSection';
import { AccountCertificationsSection } from '../components/account-sections/AccountCertificationsSection';
import { AccountLinksSection } from '../components/account-sections/AccountLinksSection';
import { AccountPersonalProjectsSection } from '../components/account-sections/AccountPersonalProjectsSection';
import { ExportResumeDialog } from '../components/account-sections/ExportResumeDialog';
import { FillAccountDataDialog } from '../components/account-sections/FillAccountDataDialog';
import { useTour } from '@/modules/tour/TourProvider';
import { getProfileSteps } from '@/modules/tour/steps';
import { useExportResumeFromAccount } from '@/services/resume/hook';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useAppTranslation, useLanguage } from '@/i18n/hooks';


export default function Account() {
  const { startTour, enabled } = useTour();
  const language = useLanguage() as 'en' | 'ar';
  const queryClient = useQueryClient();
  const { t } = useAppTranslation('dashboard');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFillAccountDataDialogOpen, setIsFillAccountDataDialogOpen] = useState(false);
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
        <h1 className="text-3xl font-bold">{t('account.title')}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsFillAccountDataDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('account.fill_from_cv')}
          </Button>
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('account.export_resume')}
          </Button>
        </div>
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

      {/* Fill Account Data Dialog */}
      <FillAccountDataDialog
        open={isFillAccountDataDialogOpen}
        onOpenChange={setIsFillAccountDataDialogOpen}
        onSuccess={() => {
          // Invalidate all account-related queries to trigger refetch
          // This ensures all account sections refresh with the newly filled data
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          queryClient.invalidateQueries({ queryKey: ['experiences'] });
          queryClient.invalidateQueries({ queryKey: ['educations'] });
          queryClient.invalidateQueries({ queryKey: ['skills'] });
          queryClient.invalidateQueries({ queryKey: ['languages'] });
          queryClient.invalidateQueries({ queryKey: ['certifications'] });
          queryClient.invalidateQueries({ queryKey: ['links'] });
          queryClient.invalidateQueries({ queryKey: ['personalProjects'] });
          queryClient.invalidateQueries({ queryKey: ['user'] });
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }}
      />
    </div>
  );
} 