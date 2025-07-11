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
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow jumping to any step
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
                const isAccessible = index <= currentStep || completedSteps.has(index);

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => isAccessible && handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' 
                        : isCompleted 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : isAccessible
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            : 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    whileHover={isAccessible ? { scale: 1.05 } : {}}
                    whileTap={isAccessible ? { scale: 0.95 } : {}}
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
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <currentStepData.icon className="h-6 w-6 text-blue-600" />
              {currentStepData.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
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
        </Card>
      </motion.div>


    </motion.div>
  );
} 