import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  Wand2, 
  ArrowLeft,
  RefreshCw,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useEvaluateUnified } from "@/services/evaluation/hook";
import { UnifiedEvaluationResponse, getScoreColor, getStatusColor, getStatusBadgeVariant, SECTION_DISPLAY_CONFIG } from "@/services/evaluation/types";
import { useGetMyResumes } from '@/services/resume/hook';
import { ResumeListItem } from '@/services/resume/types';

export function ResumeEvaluator() {
  const navigate = useNavigate();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<UnifiedEvaluationResponse | null>(null);

  // Hooks
  const evaluateUnified = useEvaluateUnified();
  const { data: resumes } = useGetMyResumes();

  const resumeOptions = resumes?.data?.resumes ?? [];

  const handleEvaluate = async () => {
    try {
      const result = await evaluateUnified.mutateAsync({
        resume_id: selectedResumeId
      });
      setCurrentEvaluation(result.evaluation);
      // Reset Resume Picker dropdown to default value after successful API call
      setSelectedResumeId(null);
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  const handleReEvaluate = () => {
    handleEvaluate();
  };

  const getPriorityIcon = (priority: 'good' | 'warning' | 'critical') => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: 'good' | 'warning' | 'critical') => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'good':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
  };

  // Normalize section keys coming from backend to our display config keys
  const SECTION_ALIAS: Record<string, keyof typeof SECTION_DISPLAY_CONFIG> = {
    profile: 'profile',
    user_profile: 'profile',
    personal_info: 'profile',

    experience: 'experience',

    education: 'education',

    skills: 'skills',
    technical_skills: 'skills',
    soft_skills: 'skills',

    projects: 'projects',
    personal_projects: 'projects',
    project: 'projects',

    languages: 'languages',

    certificates: 'certificates',
    certifications: 'certificates',

    links: 'links',
    personal_links: 'links',

    custom_sections: 'custom_sections',
  };

  const formatSectionName = (section: string): string => {
    // Normalize first, then try to get from config
    const normalizedKey = SECTION_ALIAS[section] ?? (section as keyof typeof SECTION_DISPLAY_CONFIG);
    const configTitle = SECTION_DISPLAY_CONFIG[normalizedKey as keyof typeof SECTION_DISPLAY_CONFIG]?.title;
    if (configTitle) {
      return configTitle;
    }
    
    // Fallback: capitalize first letter and replace underscores with spaces
    return section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, ' ');
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header */}
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

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resume Selection</CardTitle>
            <CardDescription>Choose which resume to evaluate or evaluate your current profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={selectedResumeId === null ? 'profile' : selectedResumeId} 
              onValueChange={(value) => setSelectedResumeId(value === 'profile' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a resume or profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">Current Profile (Account Data)</SelectItem>
                {resumeOptions.map((resume: ResumeListItem) => (
                  <SelectItem key={resume.id} value={resume.id}>{resume.resume_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluate</CardTitle>
            <CardDescription>Get comprehensive feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg" 
              disabled={evaluateUnified.isPending} 
              onClick={handleEvaluate}
            >
              {evaluateUnified.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Evaluate Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {evaluateUnified.error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Evaluation Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{evaluateUnified.error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Results */}
      {currentEvaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    Evaluation Results
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of your resume
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleReEvaluate} disabled={evaluateUnified.isPending}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-evaluate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-purple-600">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Overall Score</span>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(currentEvaluation.score)}`}>
                    {currentEvaluation.score}/10
                  </div>
                  <Progress value={currentEvaluation.score * 10} className="mt-2 h-2" />
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(currentEvaluation.status)} className="text-sm">
                    {currentEvaluation.status.charAt(0).toUpperCase() + currentEvaluation.status.slice(1)}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-green-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Issues Found</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentEvaluation.mistakes_issues.length}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium mb-2">Analysis Summary</h3>
                <p className="text-sm text-muted-foreground">{currentEvaluation.message}</p>
              </div>

              {/* Mistakes and Issues */}
              {currentEvaluation.mistakes_issues.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Issues & Recommendations</h3>
                  <div className="space-y-3">
                    {currentEvaluation.mistakes_issues.map((issue, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(issue.priority)}`}>
                        <div className="flex items-start gap-3">
                          {getPriorityIcon(issue.priority)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {formatSectionName(issue.section)}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(issue.priority)} className="text-xs">
                                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm">{issue.issue}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {currentEvaluation.suggestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">General Suggestions</h3>
                  <div className="space-y-2">
                    {currentEvaluation.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}