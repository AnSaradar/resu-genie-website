import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Rocket 
} from 'lucide-react';
import { ProfileCompletionData } from '@/services/profile_completion/hook';

// Types for the component
export interface ProfileCompletionWidgetProps {
  data: ProfileCompletionData;
  variant: 'status' | 'detailed' | 'checklist';
  className?: string;
  showOnlyWhenIncomplete?: boolean;
}

export function ProfileCompletionWidget({ 
  data, 
  variant, 
  className = '',
  showOnlyWhenIncomplete = false 
}: ProfileCompletionWidgetProps) {
  const { completion_percentage, section_status, stats } = data;
  
  // Don't render if showOnlyWhenIncomplete is true and profile is complete
  if (showOnlyWhenIncomplete && completion_percentage >= 50) {
    return null;
  }

  const renderStatusVariant = () => (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle>Resume Generation Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Ready to Generate</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {completion_percentage >= 70 ? "Ready" : "Incomplete"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Profile Completeness</span>
            <span className="text-sm font-medium">{completion_percentage}%</span>
          </div>
          <Progress value={completion_percentage} className="h-2" />
          {completion_percentage < 70 && (
            <p className="text-xs text-muted-foreground">
              Complete your profile to generate resumes
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderDetailedVariant = () => (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <CardTitle>Profile Completeness</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{completion_percentage}%</span>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completion_percentage} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              {section_status.profile_summary ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-600" />
              )}
              <span>Profile Summary</span>
            </div>
            <div className="flex items-center gap-1">
              {section_status.experience ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-600" />
              )}
              <span>Experience</span>
            </div>
            <div className="flex items-center gap-1">
              {section_status.education ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-600" />
              )}
              <span>Education</span>
            </div>
            <div className="flex items-center gap-1">
              {section_status.skills ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-600" />
              )}
              <span>Skills</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderChecklistVariant = () => (
    <Card className={`border-blue-200 bg-blue-50 dark:bg-blue-900/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Get Started with ResuGenie
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Follow these steps to create your first professional resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {section_status.profile_summary ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
            <span>Complete your profile</span>
          </div>
          <div className="flex items-center gap-3">
            {section_status.experience ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
            <span>Add work experience</span>
          </div>
          <div className="flex items-center gap-3">
            {section_status.education ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
            <span>Add education details</span>
          </div>
          <div className="flex items-center gap-3">
            {section_status.skills ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
            <span>Add your skills</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            <span>Generate your resume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render based on variant
  switch (variant) {
    case 'status':
      return renderStatusVariant();
    case 'detailed':
      return renderDetailedVariant();
    case 'checklist':
      return renderChecklistVariant();
    default:
      return renderStatusVariant();
  }
}
