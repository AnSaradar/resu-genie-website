import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Languages,
  Award,
  Code,
  Link,
  Loader2,
  X,
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  apiError?: string | null;
  isApiLoading?: boolean;
  onDismissError?: () => void;
  validationErrors?: string[];
}

export function ResumePreview({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  apiError,
  isApiLoading = false,
  onDismissError,
  validationErrors = [],
}: ResumePreviewProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const sections = [
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      count: data.experience?.length || 0,
      items: data.experience || []
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      count: data.education?.length || 0,
      items: data.education || []
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Lightbulb,
      count: data.skills?.length || 0,
      items: data.skills || []
    },
    {
      id: 'languages',
      title: 'Languages',
      icon: Languages,
      count: data.languages?.length || 0,
      items: data.languages || []
    },
    {
      id: 'certificates',
      title: 'Certificates',
      icon: Award,
      count: data.certificates?.length || 0,
      items: data.certificates || []
    },
    {
      id: 'links',
      title: 'Links',
      icon: Link,
      count: data.links?.length || 0,
      items: data.links || []
    },
    {
      id: 'personalProjects',
      title: 'Personal Projects',
      icon: Code,
      count: data.personalProjects?.length || 0,
      items: data.personalProjects || []
    }
  ];

  const totalItems = sections.reduce((sum, section) => sum + section.count, 0);
  const completedSections = sections.filter(section => section.count > 0).length;
  const completionPercentage = (completedSections / sections.length) * 100;

  // Generation logic is now handled by the parent (ResumeGenerator) via StepNavigation

  const handleReviewOpen = () => setIsReviewOpen(true);
  const handleReviewClose = () => setIsReviewOpen(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Review & Generate</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Review your resume content and generate your professional resume
        </p>
      </div>

      {/* Completion Status */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Resume Completion</h4>
                <p className="text-sm text-muted-foreground">
                  {completedSections} of {sections.length} sections completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(completionPercentage)}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections Summary */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const hasContent = section.count > 0;

                return (
                  <div
                    key={section.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      hasContent
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      hasContent ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        hasContent ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm truncate">{section.title}</h5>
                        {hasContent ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {section.count} item{section.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Template Selection */}
      {data.selectedTemplate && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Selected Template</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {data.selectedTemplate ? data.selectedTemplate.replace('-', ' ') : 'No template selected'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={itemVariants}>
        <div className="space-y-4">
          {/* Preview Button */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReviewOpen}
                  className="w-full gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Review Resume Content
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  See how your resume will look before generating
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Removed duplicated generate button card */}
        </div>
      </motion.div>

      {/* Error Display or Pro Tips */}
      <motion.div variants={itemVariants}>
        {apiError || isApiLoading ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {isApiLoading ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1 min-w-0">
                  {isApiLoading ? (
                    <div className="text-blue-800 dark:text-blue-200">
                      <p className="font-medium">Processing your request...</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Please wait while we save and download your resume.
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-800 dark:text-red-200">
                      <p className="font-medium">Error occurred</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1 whitespace-pre-line">
                        {apiError}
                      </p>
                    </div>
                  )}
                </div>
                
                {onDismissError && !isApiLoading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismissError}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : validationErrors.length > 0 ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Please complete the following required fields:
                  </h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                    Pro Tips
                  </h5>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• Add at least 2-3 work experiences for better impact</li>
                    <li>• Include 8-12 relevant skills</li>
                    <li>• Quantify achievements with numbers when possible</li>
                    <li>• Keep descriptions concise and action-oriented</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Navigation footer is handled globally via StepNavigation */}

      {/* Review Content Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Content Review</DialogTitle>
            <DialogDescription>
              Please review the information below. You will not be able to edit data in this view.
            </DialogDescription>
          </DialogHeader>

          {/* Personal Info */}
          {data.personalInfo && (
            <section className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {Object.entries(data.personalInfo || {}).map(([key, value]) => {
                  // Skip empty values and ID fields
                  if (value === null || value === undefined || value === '' || key === 'id' || String(value).trim() === '') {
                    return null;
                  }
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-muted-foreground break-words">
                        {String(value).trim()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dynamic Sections */}
          {sections.map((section) => (
            <section key={section.id} className="mb-6">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <section.icon className="h-4 w-4" /> {section.title}
              </h4>
              {section.count === 0 ? (
                <p className="text-sm text-muted-foreground">No data provided.</p>
              ) : (
                <div className="space-y-4">
                  {section.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-md border p-4 text-sm flex flex-col gap-1 bg-muted/50"
                    >
                      {Object.entries(item).map(([key, value]) => {
                        // Skip empty values and ID fields
                        if (value === null || value === undefined || value === '' || key === 'id' || String(value).trim() === '') {
                          return null;
                        }
                        return (
                          <div key={key} className="flex gap-2">
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}:&nbsp;
                            </span>
                            <span className="text-muted-foreground break-words">
                              {String(value).trim()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 