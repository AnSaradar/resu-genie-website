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
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetResumeDetails, useUpdateAndDownloadResume } from '@/services/resume/hook';
import { useEffect } from 'react';
import { updateResume } from '@/services/resume/service';
import { toast } from 'react-hot-toast';
import { useTour } from '@/modules/tour/TourProvider';
import { getResumeSteps } from '@/modules/tour/steps';

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
import { useGenerateAndDownloadResume, useGetMyResumes } from '@/services/resume/hook';
import { mapResumeDataToCreateRequest } from '@/utils/resume-mapper';
import { mapBackendResumeToFrontend } from '@/utils/resume-mapper';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ResumeNamingDialog } from '@/components/resume/ResumeNamingDialog';

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
  experience?: Experience[];
  education?: any[];
  skills?: any[];
  languages?: any[];
  certificates?: any[];
  personalProjects?: any[];
  selectedTemplate?: string;
  resumeName?: string;
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
  const location = useLocation();
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
  const updateResumeMutation = useUpdateAndDownloadResume();
  const { data: myResumesData } = useGetMyResumes();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showNamingDialog, setShowNamingDialog] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<{
    createPayload: any;
    templateName: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { startTour, enabled, language } = useTour();

  // Load CV extracted data if available (for new resumes only)
  useEffect(() => {
    if (!isEditMode) {
      // Prefer navigation state first (more reliable than session storage)
      const stateData: any = (location as any)?.state?.cvExtractedData;
      if (stateData) {
        try {
          setResumeData(prevData => ({
            ...prevData,
            ...stateData,
            experience: stateData.experience || prevData.experience || [],
            education: stateData.education || prevData.education || [],
            skills: stateData.skills || prevData.skills || [],
            languages: stateData.languages || prevData.languages || [],
            certificates: stateData.certificates || prevData.certificates || [],
            personalProjects: stateData.personalProjects || prevData.personalProjects || [],
          }));
          setCompletedSteps(new Set([0, 1, 2, 3, 4, 5, 6]));
          toast.success('Resume data imported from CV! Review and edit as needed.', { duration: 4000 });
          // Clear the data from session storage since we used state data
          sessionStorage.removeItem('cv-extracted-data');
          return; // Skip sessionStorage path if state was provided
        } catch (e) {
          console.error('Error applying state CV data:', e);
        }
      }

      const cvExtractedData = sessionStorage.getItem('cv-extracted-data');
      console.log('CV extracted data from session storage:', cvExtractedData);
      
      if (cvExtractedData) {
        try {
          const parsedData = JSON.parse(cvExtractedData);
          console.log('Parsed CV data:', parsedData);
          
          // Make sure we have a complete data structure
          setResumeData(prevData => {
            const mergedData = {
              ...prevData,
              ...parsedData,
              // Ensure these arrays exist even if they're not in the parsed data
              experience: parsedData.experience || prevData.experience || [],
              education: parsedData.education || prevData.education || [],
              skills: parsedData.skills || prevData.skills || [],
              languages: parsedData.languages || prevData.languages || [],
              certificates: parsedData.certificates || prevData.certificates || [],
              personalProjects: parsedData.personalProjects || prevData.personalProjects || [],
            };
            
            console.log('Merged resume data:', mergedData);
            return mergedData;
          });
          
          // Clear the data from session storage after loading
          sessionStorage.removeItem('cv-extracted-data');
          
          // Mark all steps as completed
          setCompletedSteps(new Set([0, 1, 2, 3, 4, 5, 6]));
          
          // Show success notification
          toast.success('Resume data imported from CV! Review and edit as needed.', {
            duration: 4000,
          });
        } catch (error) {
          console.error('Error parsing CV extracted data:', error);
          toast.error('Error loading imported CV data. Please try again.');
        }
      }
    }
  }, [isEditMode, location.state]);

  // Start resume tour when component mounts
  useEffect(() => {
    if (enabled && !isEditMode) {
      const steps = getResumeSteps(language);
      startTour({ tourKey: 'resume', steps, autoRun: true });
    }
  }, [enabled, language, isEditMode, startTour]);

  // Validation function to check all required fields
  const validateResumeData = (data: ResumeData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate Personal Info (required)
    if (!data.personalInfo) {
      errors.push('Personal Information is required');
    } else {
      const { personalInfo } = data;
      if (!personalInfo.firstName?.trim()) errors.push('First name is required');
      if (!personalInfo.lastName?.trim()) errors.push('Last name is required');
      if (!personalInfo.email?.trim()) errors.push('Email is required');
      if (!personalInfo.phone?.trim()) errors.push('Phone number is required');
      if (!personalInfo.birthDate?.trim()) errors.push('Birth date is required');
    }

    // Validate Experience (at least one required)
    if (!data.experience || data.experience.length === 0) {
      errors.push('At least one work experience is required');
    } else {
      data.experience.forEach((exp, index) => {
        if (!exp.title?.trim()) errors.push(`Experience ${index + 1}: Job title is required`);
        if (!exp.company?.trim()) errors.push(`Experience ${index + 1}: Company name is required`);
        if (!exp.start_date?.trim()) errors.push(`Experience ${index + 1}: Start date is required`);
        if (exp.currently_working === undefined || exp.currently_working === null) {
          errors.push(`Experience ${index + 1}: Please specify if you are currently working here`);
        }
        if (!exp.currently_working && !exp.end_date?.trim()) {
          errors.push(`Experience ${index + 1}: End date is required when not currently working`);
        }
      });
    }

    // Validate Education (at least one required)
    if (!data.education || data.education.length === 0) {
      errors.push('At least one education entry is required');
    } else {
      data.education.forEach((edu, index) => {
        if (!edu.institution?.trim()) errors.push(`Education ${index + 1}: Institution name is required`);
        if (!edu.degree?.trim()) errors.push(`Education ${index + 1}: Degree is required`);
        if (!edu.field?.trim()) errors.push(`Education ${index + 1}: Field of study is required`);
        if (!edu.start_date?.trim()) errors.push(`Education ${index + 1}: Start date is required`);
        if (edu.currently_studying === undefined || edu.currently_studying === null) {
          errors.push(`Education ${index + 1}: Please specify if you are currently studying`);
        }
        if (!edu.currently_studying && !edu.end_date?.trim()) {
          errors.push(`Education ${index + 1}: End date is required when not currently studying`);
        }
      });
    }

    // Validate Skills (at least one required)
    if (!data.skills || data.skills.length === 0) {
      errors.push('At least one skill is required');
    } else {
      data.skills.forEach((skill, index) => {
        if (!skill.name?.trim()) errors.push(`Skill ${index + 1}: Skill name is required`);
      });
    }

    // Validate Languages (at least one required)
    if (!data.languages || data.languages.length === 0) {
      errors.push('At least one language is required');
    } else {
      data.languages.forEach((lang, index) => {
        if (!lang.name?.trim()) errors.push(`Language ${index + 1}: Language name is required`);
        if (!lang.proficiency?.trim()) errors.push(`Language ${index + 1}: Proficiency level is required`);
      });
    }

    // Validate Certificates (optional but if present, validate required fields)
    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((cert, index) => {
        if (!cert.name?.trim()) errors.push(`Certificate ${index + 1}: Certificate name is required`);
        if (!cert.issuingOrganization?.trim()) errors.push(`Certificate ${index + 1}: Issuing organization is required`);
        if (!cert.issueDate?.trim()) errors.push(`Certificate ${index + 1}: Issue date is required`);
      });
    }

    // Validate Personal Projects (optional but if present, validate required fields)
    if (data.personalProjects && data.personalProjects.length > 0) {
      data.personalProjects.forEach((project, index) => {
        if (!project.title?.trim()) errors.push(`Project ${index + 1}: Project title is required`);
        if (!project.description?.trim()) errors.push(`Project ${index + 1}: Project description is required`);
      });
    }

    // Validate Template Selection
    if (!data.selectedTemplate?.trim()) {
      errors.push('Please select a resume template');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Prefill for edit mode
  useEffect(() => {
    if (isEditMode && fetchedResume && fetchedResume.resume) {
      console.log('Loading existing resume data:', fetchedResume.resume);
      // Map backend resume to ResumeData shape using the mapper utility
      const transformedData = mapBackendResumeToFrontend(fetchedResume.resume);
      console.log('Transformed data for frontend:', transformedData);
      setResumeData(transformedData);
    }
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
    if (isGenerating || isApiLoading) return;
    setUpdateError(null);
    setValidationErrors([]);
    setApiError(null);

    // Validate all required fields before proceeding
    const validation = validateResumeData(resumeData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error('Please complete all required fields before generating your resume');
      return;
    }

    // Ensure a template is selected – default to moey if not
    const templateMap: Record<string, string> = {
      moey: 'moey_template.html',
      imagine: 'imagine_template.html',
      jobscan: 'jobscan_template.html',
    };

    const templateId = resumeData.selectedTemplate ?? 'moey';
    const templateName = templateMap[templateId] ?? 'moey_template.html';

    // Always map the data to ensure proper formatting (dates, language levels, etc.)
    const mappedPayload = mapResumeDataToCreateRequest(resumeData);

    // Store the generation data
    setPendingGeneration({ createPayload: mappedPayload, templateName });
    
    // Only show naming dialog for NEW resumes, not updates
    if (isEditMode && resumeId) {
      // For updates, use existing resume name and proceed directly
      const existingName = resumeData?.resumeName || 'Updated Resume';
      handleResumeNameConfirm(existingName);
    } else {
      // For new resumes, show naming dialog
      setShowNamingDialog(true);
    }
  };

  // Handle resume naming confirmation
  const handleResumeNameConfirm = async (resumeName: string) => {
    if (!pendingGeneration) return;

    setIsGenerating(true);
    setIsApiLoading(true);
    setShowNamingDialog(false);
    setApiError(null);

    try {
      if (isEditMode && resumeId) {
        // Update existing resume - NO NAMING DIALOG NEEDED
        updateResumeMutation.mutate(
          { 
            resumeId: resumeId,
            updatePayload: pendingGeneration.createPayload, 
            templateName: pendingGeneration.templateName,
            customFileName: resumeName // Use existing resume name, no custom name needed
          },
          {
            onSettled: () => {
              setIsGenerating(false);
              setIsApiLoading(false);
            },
            onSuccess: () => {
              toast.success('Resume updated successfully!');
              // Navigate to resume section after successful update
              navigate('/dashboard/resumes');
            },
            onError: (error: any) => {
              handleApiError(error);
            }
          }
        );
      } else {
        // Create new resume with mapped data and custom filename
        generateResumeMutation.mutate(
          { 
            createPayload: pendingGeneration.createPayload, 
            templateName: pendingGeneration.templateName,
            customFileName: resumeName
          },
          {
            onSettled: () => {
              setIsGenerating(false);
              setIsApiLoading(false);
            },
            onSuccess: () => {
              toast.success('Resume created successfully!');
              // Navigate to resume section after successful generation
              navigate('/dashboard/resumes');
            },
            onError: (error: any) => {
              handleApiError(error);
            }
          }
        );
      }
    } catch (err: any) {
      setIsGenerating(false);
      setIsApiLoading(false);
      handleApiError(err);
    } finally {
      setPendingGeneration(null);
    }
  };

  // Handle API errors consistently
  const handleApiError = (error: any) => {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error?.response?.data?.detail) {
      const validationErrors = error.response.data.detail;
      if (Array.isArray(validationErrors)) {
        // Format validation errors for display
        const errorMessages = validationErrors.map((err: any) => {
          const field = err.loc?.join('.') || 'unknown';
          return `${field}: ${err.msg}`;
        });
        errorMessage = `Validation errors:\n${errorMessages.join('\n')}`;
      } else {
        errorMessage = validationErrors;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    setApiError(errorMessage);
    setUpdateError(errorMessage);
  };

  // Handle naming dialog close
  const handleNamingDialogClose = () => {
    setShowNamingDialog(false);
    setPendingGeneration(null);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    // Clear validation errors when navigating to a step
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const updateResumeData = (stepData: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...stepData }));
    // Clear validation errors when user starts editing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Helper function to check if a step has validation errors
  const getStepValidationErrors = (stepIndex: number): string[] => {
    const stepId = STEPS[stepIndex]?.id;
    if (!stepId || validationErrors.length === 0) return [];
    
    return validationErrors.filter(error => {
      switch (stepId) {
        case 'personal':
          return error.includes('Personal Information') || error.includes('First name') || 
                 error.includes('Last name') || error.includes('Email') || 
                 error.includes('Phone number') || error.includes('Birth date');
        case 'experience':
          return error.includes('Experience');
        case 'education':
          return error.includes('Education');
        case 'skills':
          return error.includes('Skill');
        case 'languages':
          return error.includes('Language');
        case 'certificates':
          return error.includes('Certificate');
        case 'personalProjects':
          return error.includes('Project');
        case 'template':
          return error.includes('template');
        default:
          return false;
      }
    });
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
    <>
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
      <motion.div variants={itemVariants} data-tour="resume-steps">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap justify-center gap-2" data-tour="step-navigation">
              {STEPS.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.has(index);
                const hasErrors = getStepValidationErrors(index).length > 0;
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium relative
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' 
                        : isCompleted 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-blue-300'
                          : hasErrors
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : hasErrors ? (
                      <div className="relative">
                        <IconComponent className="h-4 w-4" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    {hasErrors && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        ({getStepValidationErrors(index).length})
                      </span>
                    )}
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
            {updateError && currentStep !== STEPS.length - 1 && (
              <div className="mb-4 text-destructive text-center font-medium whitespace-pre-line">{updateError}</div>
            )}
            {validationErrors.length > 0 && currentStep !== STEPS.length - 1 && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">Please complete the following required fields:</h4>
                <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
                  {...(currentStep === STEPS.length - 1 && {
                    apiError,
                    isApiLoading,
                    onDismissError: () => setApiError(null),
                    validationErrors
                  })}
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
            isLoading={isApiLoading}
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

      {/* Resume Naming Dialog */}
      <ResumeNamingDialog
        isOpen={showNamingDialog}
        onClose={handleNamingDialogClose}
        onConfirm={handleResumeNameConfirm}
        existingResumeNames={myResumesData?.data?.resumes?.map(r => r.resume_name) || []}
        defaultName={`${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''}`.trim() || 'Resume'}
        isLoading={isGenerating}
      />

    </motion.div>
    </>
  );
}