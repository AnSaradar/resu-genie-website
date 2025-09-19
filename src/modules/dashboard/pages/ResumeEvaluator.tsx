import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Wand2, 
  ArrowLeft,
  RefreshCw,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { ResumeSelector } from "@/components/evaluation/ResumeSelector";
import { EvaluationResults } from "@/components/evaluation/EvaluationResults";
import { useResumeEvaluation, useGetEvaluationHistory } from "@/services/evaluation/hook";
import { CompleteEvaluationResponse } from "@/services/evaluation/types";
import { useTour } from "@/modules/tour/TourProvider";
import { getEvaluationSteps } from "@/modules/tour/steps";

export function ResumeEvaluator() {
  const navigate = useNavigate();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<'complete' | 'user_profile' | 'experience' | 'education'>('complete');
  const [currentEvaluation, setCurrentEvaluation] = useState<CompleteEvaluationResponse | null>(null);

  // Hooks
  const { evaluateResume, isLoading, error } = useResumeEvaluation();
  const { data: evaluationHistory } = useGetEvaluationHistory();
  const { startTour, enabled, language } = useTour();

  // Start evaluation tour when component mounts
  useEffect(() => {
    if (enabled) {
      const steps = getEvaluationSteps(language);
      startTour({ tourKey: 'evaluation', steps, autoRun: true });
    }
  }, [enabled, language, startTour]);

  const handleEvaluate = async () => {
    try {
      const result = await evaluateResume(selectedResumeId, selectedEvaluationType);
      setCurrentEvaluation(result.evaluation);
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  const handleReEvaluate = () => {
    handleEvaluate();
  };

  const handleDownloadReport = () => {
    // TODO: Implement report download functionality
    console.log('Download report functionality to be implemented');
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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Wand2 className="h-8 w-8 text-purple-600" />
              Resume Evaluator
            </h1>
            <p className="text-muted-foreground mt-2">
              Get AI-powered feedback and suggestions to improve your resume
            </p>
          </div>
        </div>
      </motion.div>

      {/* Resume Selection */}
      <motion.div variants={itemVariants} data-tour="resume-selector">
        <ResumeSelector
          selectedResumeId={selectedResumeId}
          onResumeSelect={setSelectedResumeId}
        />
      </motion.div>

      {/* Evaluation Options */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Type</CardTitle>
            <CardDescription>
              Choose what you'd like to evaluate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={selectedEvaluationType} 
              onValueChange={(value) => setSelectedEvaluationType(value as any)}
              className="w-full"
              data-tour="evaluation-types"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="complete">Complete</TabsTrigger>
                <TabsTrigger value="user_profile">Profile</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="complete" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Complete Evaluation</h3>
                      <p className="text-sm text-muted-foreground">
                        Get comprehensive feedback on your entire {selectedResumeId ? 'resume' : 'profile'} including profile, experience, and education
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleEvaluate} 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Evaluate Complete {selectedResumeId ? 'Resume' : 'Profile'}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="user_profile" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Profile Evaluation</h3>
                      <p className="text-sm text-muted-foreground">
                        Evaluate your profile summary, LinkedIn URL, current position, and work field
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleEvaluate} 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Evaluate Profile
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    <div>
                      <h3 className="font-medium">Experience Evaluation</h3>
                      <p className="text-sm text-muted-foreground">
                        Get feedback on your work experience entries, job descriptions, and achievements
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleEvaluate} 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Evaluate Experience
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Education Evaluation</h3>
                      <p className="text-sm text-muted-foreground">
                        Review your educational qualifications, institutions, and academic achievements
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleEvaluate} 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Evaluate Education
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div variants={itemVariants}>
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Evaluation Error</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error.message}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Evaluation Results */}
      {currentEvaluation && (
        <motion.div variants={itemVariants} data-tour="evaluation-results">
          <EvaluationResults
            evaluation={currentEvaluation}
            isLoading={isLoading}
            onReEvaluate={handleReEvaluate}
            onDownloadReport={handleDownloadReport}
          />
        </motion.div>
      )}

      {/* Evaluation History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Evaluation History</CardTitle>
            <CardDescription>
              Track your progress over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluationHistory?.evaluations && evaluationHistory.evaluations.length > 0 ? (
              <div className="space-y-3">
                {evaluationHistory.evaluations.slice(0, 5).map((evaluation) => (
                  <div key={evaluation._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {evaluation.evaluation_area === 'user_profile' && <User className="h-4 w-4 text-green-600" />}
                        {evaluation.evaluation_area === 'experience' && <Briefcase className="h-4 w-4 text-orange-600" />}
                        {evaluation.evaluation_area === 'education' && <GraduationCap className="h-4 w-4 text-purple-600" />}
                        {evaluation.evaluation_area === 'complete' && <BarChart3 className="h-4 w-4 text-blue-600" />}
                        <span className="font-medium capitalize">
                          {evaluation.evaluation_area.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(evaluation.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{evaluation.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evaluation history yet</p>
                <p className="text-sm">Complete your first evaluation to see your progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
