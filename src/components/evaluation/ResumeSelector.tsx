import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useGetMyResumes } from '@/services/resume/hook';
import { FileText, Calendar, User, Loader2 } from 'lucide-react';
// Simple date formatting helper
const formatDateAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

interface ResumeSelectorProps {
  selectedResumeId: string | null;
  onResumeSelect: (resumeId: string | null) => void;
  className?: string;
}

export function ResumeSelector({ selectedResumeId, onResumeSelect, className }: ResumeSelectorProps) {
  const { data: resumesData, isLoading, error } = useGetMyResumes();
  const [showAllResumes, setShowAllResumes] = useState(false);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Resume to Evaluate
          </CardTitle>
          <CardDescription>
            Choose a saved resume to evaluate, or evaluate your current profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading your resumes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Resume to Evaluate
          </CardTitle>
          <CardDescription>
            Choose a saved resume to evaluate, or evaluate your current profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Failed to load resumes</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const resumes = resumesData?.data?.resumes || [];
  const displayedResumes = showAllResumes ? resumes : resumes.slice(0, 3);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Select Resume to Evaluate
        </CardTitle>
        <CardDescription>
          Choose a saved resume to evaluate, or evaluate your current profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedResumeId || 'profile'}
          onValueChange={(value) => onResumeSelect(value === 'profile' ? null : value)}
          className="space-y-3"
        >
          {/* Current Profile Option */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="profile" id="profile" />
            <Label htmlFor="profile" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Current Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Evaluate your current profile data
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Profile
                </Badge>
              </div>
            </Label>
          </div>

          {/* Saved Resumes */}
          {displayedResumes.length > 0 ? (
            displayedResumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={resume.id} id={resume.id} />
                <Label htmlFor={resume.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{resume.resume_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {resume.created_at
                              ? formatDateAgo(resume.created_at)
                              : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Resume
                    </Badge>
                  </div>
                </Label>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved resumes found</p>
              <p className="text-sm">Create a resume first to evaluate it</p>
            </div>
          )}

          {/* Show More/Less Button */}
          {resumes.length > 3 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllResumes(!showAllResumes)}
                className="w-full"
              >
                {showAllResumes
                  ? `Show Less (${resumes.length - 3} hidden)`
                  : `Show All Resumes (${resumes.length - 3} more)`}
              </Button>
            </div>
          )}
        </RadioGroup>

        {/* Selection Summary */}
        {selectedResumeId && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              Selected: {resumes.find(r => r.id === selectedResumeId)?.resume_name || 'Unknown Resume'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
