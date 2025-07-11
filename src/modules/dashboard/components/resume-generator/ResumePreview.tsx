import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Download, 
  Eye, 
  Edit,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Languages,
  Award,
  Code
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ResumePreview({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: ResumePreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement actual resume generation
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate generation
    setIsGenerating(false);
    // TODO: Navigate to generated resume or download
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview resume with data:', data);
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
                    {data.selectedTemplate.replace('-', ' ')}
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
                  onClick={handlePreview}
                  className="w-full gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Resume
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  See how your resume will look before generating
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || totalItems === 0}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Build My Resume
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {totalItems === 0 
                    ? 'Add some content to build your resume'
                    : 'Your resume will be built and ready for download'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants}>
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
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || totalItems === 0}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Build Resume
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 