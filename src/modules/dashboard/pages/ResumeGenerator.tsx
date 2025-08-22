import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Languages,
  Award,
  Code,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetResumeDetails } from '@/services/resume/hook';
import { useEffect } from 'react';
import { updateResume } from '@/services/resume/service';

// Step components (we'll create these)
import { PersonalInfoStep } from '../components/resume-generator/PersonalInfoStep';
import { ExperienceStep } from '../components/resume-generator/ExperienceStep';
import { EducationStep } from '../components/resume-generator/EducationStep';
import { SkillsStep } from '../components/resume-generator/SkillsStep';
import { LanguagesStep } from '../components/resume-generator/LanguagesStep';
import { CertificatesStep } from '../components/resume-generator/CertificatesStep';
import { PersonalProjectsStep } from '../components/resume-generator/PersonalProjectsStep';
import { TemplateSelectionStep } from '../components/resume-generator/TemplateSelectionStep';
import { ResumePreview } from '../components/resume-generator/ResumePreview';
import { Experience } from '@/services/experience/types';
import { StepNavigation } from '../components/resume-generator/StepNavigation';
import { useGenerateAndDownloadResume } from '@/services/resume/hook';
import { mapResumeDataToCreateRequest } from '@/utils/resume-mapper';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedinUrl: string;
  websiteUrl: string;
  currentPosition: string;
  profileSummary: string;
  seniorityLevel: string;
  workField: string;
  yearsOfExperience: number | string;
  birthDate: string;
}

export interface ResumeData {
  personalInfo?: PersonalInfo;
  experience: Experience[];
  education: any[];
  skills: any[];
  languages: any[];
  certificates: any[];
  personalProjects: any[];
  selectedTemplate?: string;
}

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Add your personal information',
    icon: User,
    component: PersonalInfoStep
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Add your work experience',
    icon: Briefcase,
    component: ExperienceStep
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Add your educational background',
    icon: GraduationCap,
    component: EducationStep
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'List your technical and soft skills',
    icon: Lightbulb,
    component: SkillsStep
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Add languages you speak',
    icon: Languages,
    component: LanguagesStep
  },
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'Add your certifications',
    icon: Award,
    component: CertificatesStep
  },
  {
    id: 'personalProjects',
    title: 'Personal Projects',
    description: 'Showcase your projects',
    icon: Code,
    component: PersonalProjectsStep
  },
  {
    id: 'template',
    title: 'Choose Template',
    description: 'Select your resume template',
    icon: FileText,
    component: TemplateSelectionStep
  },
  {
    id: 'preview',
    title: 'Preview & Generate',
    description: 'Review and generate your resume',
    icon: Sparkles,
    component: ResumePreview
  }
];

export function ResumeGenerator() {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const isEditMode = !!resumeId;
  const {
    data: fetchedResume,
    isLoading: loadingResume,
    error: fetchError,
  } = useGetResumeDetails(resumeId ?? '', isEditMode);

  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
    personalProjects: [],
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const generateResumeMutation = useGenerateAndDownloadResume();
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Prefill for edit mode
  useEffect(() => {
    if (isEditMode && fetchedResume && fetchedResume.resume) {
      // Map backend resume to ResumeData shape if needed
      setResumeData({
        ...resumeData,
        ...fetchedResume.resume,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, fetchedResume]);

  // Mapping logic is now centralized in utils/resume-mapper

  const currentStepData = STEPS[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Final step action – save and download resume
  const handleSaveAndDownload = async () => {
    if (isGenerating) return;
    setUpdateError(null);

    // Ensure a template is selected – default to moey if not
    const templateMap: Record<string, string> = {
      moey: 'moey_template.html',
      imagine: 'imagine_template.html',
      jobscan: 'jobscan_template.html',
    };

    const templateId = resumeData.selectedTemplate ?? 'moey';
    const templateName = templateMap[templateId] ?? 'moey_template.html';

    setIsGenerating(true);
    try {
      if (isEditMode && resumeId) {
        // Update existing resume
        await updateResume(resumeId, resumeData); // You may need to map data shape
        // After update, trigger download
        generateResumeMutation.mutate(
          { createPayload: mapResumeDataToCreateRequest(resumeData), templateName },
          {
            onSettled: () => setIsGenerating(false),
            onSuccess: () => {
              // Navigate to resume section after successful generation
              navigate('/dashboard/resumes');
            },
          }
        );
      } else {
        // Create new resume
        generateResumeMutation.mutate(
          { createPayload: mapResumeDataToCreateRequest(resumeData), templateName },
          {
            onSettled: () => setIsGenerating(false),
            onSuccess: () => {
              // Navigate to resume section after successful generation
              navigate('/dashboard/resumes');
            },
          }
        );
      }
    } catch (err: any) {
      setIsGenerating(false);
      setUpdateError(err?.message || 'Failed to update resume.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const updateResumeData = (stepData: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...stepData }));
  };

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

  if (loadingResume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <div className="text-2xl font-bold mb-4">Failed to load resume for editing</div>
        <div>{fetchError.message}</div>
        <Button className="mt-6" onClick={() => navigate('/dashboard/resumes')}>Back to My Resumes</Button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Build a Resume</h1>
              <p className="text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}: {currentStepData.title}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">
              Progress: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-48" />
          </div>
        </div>
      </motion.div>

      {/* Steps Navigation */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap justify-center gap-2">
              {STEPS.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.has(index);
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' 
                        : isCompleted 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Content */}
      <motion.div variants={itemVariants}>
        <Card className="min-h-[600px] relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <currentStepData.icon className="h-6 w-6 text-blue-600" />
              {currentStepData.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>
          <CardContent className="pb-24">
            {updateError && (
              <div className="mb-4 text-destructive text-center font-medium">{updateError}</div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepComponent
                  data={resumeData}
                  onUpdate={updateResumeData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === STEPS.length - 1}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
          {/* Unified Navigation */}
          <StepNavigation
            onPrevious={handlePrevious}
            onNext={currentStep === STEPS.length - 1 ? handleSaveAndDownload : handleNext}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === STEPS.length - 1}
            nextLabel={currentStep === STEPS.length - 1 ? 'Save & Download Resume' : `Next: ${STEPS[currentStep + 1].title}`}
            nextDisabled={currentStep === 0 && !(resumeData.personalInfo?.firstName && resumeData.personalInfo?.lastName && resumeData.personalInfo?.email && resumeData.personalInfo?.birthDate)}
          />
        </Card>
      </motion.div>

      {/* Loader Dialog */}
      <Dialog open={isGenerating}>
        <DialogContent className="flex flex-col items-center justify-center gap-4 w-80 py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/40"
          >
            <FileText className="h-8 w-8 text-blue-600" />
          </motion.div>
          <p className="text-center text-sm">Hang tight! We are crafting your awesome resume...</p>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </DialogContent>
      </Dialog>

    </motion.div>
  );
} 