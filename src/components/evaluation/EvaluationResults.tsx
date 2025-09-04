import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CompleteEvaluationResponse, 
  getScoreColor, 
  getScoreLabel, 
  getScoreBadgeVariant 
} from '@/services/evaluation/types';
import { 
  Star, 
  User, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Lightbulb, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface EvaluationResultsProps {
  evaluation: CompleteEvaluationResponse;
  isLoading?: boolean;
  onReEvaluate?: () => void;
  onDownloadReport?: () => void;
  className?: string;
}

export function EvaluationResults({ 
  evaluation, 
  isLoading = false, 
  onReEvaluate, 
  onDownloadReport,
  className 
}: EvaluationResultsProps) {
  const { 
    overall_score, 
    user_profile_evaluation, 
    experience_evaluation, 
    education_evaluation, 
    overall_suggestions 
  } = evaluation;

  const getStatusIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const evaluationAreas = [
    {
      key: 'user_profile',
      title: 'Profile',
      icon: User,
      evaluation: user_profile_evaluation,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      key: 'experience',
      title: 'Experience',
      icon: Briefcase,
      evaluation: experience_evaluation,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      key: 'education',
      title: 'Education',
      icon: GraduationCap,
      evaluation: education_evaluation,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Score Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Overall Evaluation Score
              </CardTitle>
              <CardDescription>
                Comprehensive assessment of your resume
              </CardDescription>
            </div>
            <Badge variant={getScoreBadgeVariant(overall_score)} className="text-lg px-3 py-1">
              {overall_score.toFixed(1)}/10
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Score Display */}
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(overall_score)} mb-2`}>
                {overall_score.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-medium">{getScoreLabel(overall_score)}</span>
              </div>
              <Progress 
                value={overall_score * 10} 
                className="h-4 mb-4" 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {onDownloadReport && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onDownloadReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
              {onReEvaluate && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onReEvaluate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Re-evaluate
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Area Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {evaluationAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <Card key={area.key} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${area.bgColor}`} />
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${area.color}`} />
                      <span className="font-medium">{area.title}</span>
                    </div>
                    {getStatusIcon(area.evaluation.score)}
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(area.evaluation.score)}`}>
                      {area.evaluation.score}/10
                    </div>
                    <Badge 
                      variant={getScoreBadgeVariant(area.evaluation.score)} 
                      className="mt-1"
                    >
                      {getScoreLabel(area.evaluation.score)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <Progress 
                    value={area.evaluation.score * 10} 
                    className="h-2" 
                  />

                  {/* Message */}
                  <p className="text-sm text-muted-foreground text-center">
                    {area.evaluation.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <CardTitle>Improvement Suggestions</CardTitle>
          </div>
          <CardDescription>
            Actionable recommendations to enhance your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Suggestions */}
            {overall_suggestions && overall_suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overall Recommendations
                </h4>
                <div className="space-y-2">
                  {overall_suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Area-specific Suggestions */}
            {evaluationAreas.map((area) => {
              if (area.evaluation.suggestions && area.evaluation.suggestions.length > 0) {
                return (
                  <div key={area.key}>
                    <Separator className="my-4" />
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <area.icon className="h-4 w-4" />
                      {area.title} Suggestions
                    </h4>
                    <div className="space-y-2">
                      {area.evaluation.suggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-muted-foreground text-background rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
