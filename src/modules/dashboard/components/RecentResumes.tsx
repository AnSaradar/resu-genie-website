import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useGetMyResumes, useGetResumeDetails } from '@/services/resume/hook';
import { ResumeListItem } from '@/services/resume/types';
import { ResumePreview } from './resume-generator/ResumePreview';
import { mapBackendResumeToFrontend } from '@/utils/resume-mapper';
import { 
  FileText, 
  Eye, 
  Edit3,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppTranslation } from '@/i18n/hooks';
import { useFormatRelativeTime, useFormatDate } from '@/utils/date-i18n';

export function RecentResumes() {
  const navigate = useNavigate();
  const { t } = useAppTranslation('dashboard');
  const { data, isLoading } = useGetMyResumes(4);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const formatRelativeTime = useFormatRelativeTime();
  const formatDate = useFormatDate();
  
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetResumeDetails(previewId ?? '', !!previewId);

  const getResumeStatus = (resume: ResumeListItem) => {
    if (!resume.updated_at || resume.updated_at === resume.created_at) {
      return 'draft';
    }
    return 'complete';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle>{t('recent_resumes.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading resumes...
          </div>
        </CardContent>
      </Card>
    );
  }

  const resumes = data?.data?.resumes || [];

  if (resumes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle>{t('recent_resumes.title')}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No resumes yet</p>
            <Button onClick={() => navigate('/dashboard/generate')}>
              Create Your First Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle>{t('recent_resumes.title')}</CardTitle>
          </div>
          <Link to="/dashboard/resumes">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resumes.map((resume: ResumeListItem, index: number) => {
            const status = getResumeStatus(resume);
            return (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{resume.resume_name}</h3>
                      <Badge 
                        variant={status === 'complete' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {status === 'complete' ? t('recent_resumes.complete') : t('recent_resumes.draft')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{t('recent_resumes.modified')} {formatRelativeTime(resume.updated_at || resume.created_at)}</span>
                      </div>
                      {resume.updated_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(resume.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/dashboard/resume/${resume.id}`)}
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setPreviewId(resume.id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
      
      {/* Resume Preview Dialog */}
      <Dialog open={!!previewId} onOpenChange={(open) => {
        if (!open) setPreviewId(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Resume Preview
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="outline" size="sm">Close</Button>
              </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {previewLoading && (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading resume preview...</p>
              </div>
            )}
            
            {previewError && (
              <div className="py-20 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-destructive font-medium mb-2">Failed to load preview</p>
                <p className="text-muted-foreground">{previewError.message}</p>
              </div>
            )}
            
            {previewData && previewData.resume && (
              <div className="border rounded-lg overflow-hidden">
                <ResumePreview
                  data={mapBackendResumeToFrontend(previewData.resume)}
                  onUpdate={() => {}}
                  onNext={() => {}}
                  onPrevious={() => {}}
                  isFirstStep={false}
                  isLastStep={false}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

