import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ComprehensiveEvaluationResponse, 
  getScoreColor, 
  getScoreLabel, 
  getScoreBadgeVariant,
  getStatusColor,
  getStatusLabel,
  getStatusBadgeVariant,
  SECTION_DISPLAY_CONFIG
} from '@/services/evaluation/types';
import { 
  Star, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Users,
  Award,
  Globe,
  Link,
  FolderOpen,
  FileText,
  TrendingUp, 
  Lightbulb, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Target
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap = {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Users,
  Award,
  Globe,
  Link,
  FolderOpen,
  FileText
};

interface ComprehensiveEvaluationResultsProps {
  evaluation: ComprehensiveEvaluationResponse;
  isLoading?: boolean;
  onReEvaluate?: () => void;
  onDownloadReport?: () => void;
  className?: string;
}

export function ComprehensiveEvaluationResults({ 
  evaluation, 
  isLoading = false, 
  onReEvaluate, 
  onDownloadReport,
  className 
}: ComprehensiveEvaluationResultsProps) {
  const { 
    overall_score, 
    overall_status,
    overall_message,
    section_scores, 
    section_feedback,
    cross_section_insights,
    top_priority_actions
  } = evaluation;

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // Create evaluation areas array from section scores
  const evaluationAreas = Object.entries(section_scores).map(([key, score]: [string, number]) => {
    const config = SECTION_DISPLAY_CONFIG[key as keyof typeof SECTION_DISPLAY_CONFIG];
    const feedback = section_feedback[key as keyof typeof section_feedback];
    const IconComponent = iconMap[config.icon as keyof typeof iconMap];
    
    return {
      key,
      title: config.title,
      icon: IconComponent,
      score: score as number,
      feedback,
      color: config.color,
      bgColor: config.bgColor
    };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Score Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Comprehensive Resume Evaluation
              </CardTitle>
              <CardDescription>
                {overall_message}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={getScoreBadgeVariant(overall_score)} className="text-lg px-3 py-1">
                {overall_score.toFixed(1)}/10
              </Badge>
              <Badge variant={getStatusBadgeVariant(overall_status)} className="text-sm">
                {getStatusLabel(overall_status)}
              </Badge>
            </div>
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
                  Re-Evaluate
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Scores Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Section Breakdown
          </CardTitle>
          <CardDescription>
            Individual scores for each resume section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        {getStatusIcon(area.feedback.status)}
                      </div>

                      {/* Score */}
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(area.score)}`}>
                          {area.score}/10
                        </div>
                        <Badge 
                          variant={getScoreBadgeVariant(area.score)} 
                          className="mt-1"
                        >
                          {getScoreLabel(area.score)}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <Progress 
                        value={area.score * 10} 
                        className="h-2" 
                      />

                      {/* Message */}
                      <p className="text-sm text-muted-foreground text-center">
                        {area.feedback.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Priority Actions */}
      {top_priority_actions && top_priority_actions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              <CardTitle>Top Priority Actions</CardTitle>
            </div>
            <CardDescription>
              Focus on these critical improvements first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top_priority_actions.map((action: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Priority {index + 1}
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-Section Insights */}
      {cross_section_insights && cross_section_insights.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <CardTitle>Cross-Section Insights</CardTitle>
            </div>
            <CardDescription>
              Holistic analysis and consistency observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cross_section_insights.map((insight: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Section Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle>Detailed Section Recommendations</CardTitle>
          </div>
          <CardDescription>
            Specific recommendations for each section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluationAreas.map((area, index) => {
              if (area.feedback.suggestions && area.feedback.suggestions.length > 0) {
                return (
                  <div key={area.key}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-2 mb-3">
                      <area.icon className={`h-4 w-4 ${area.color}`} />
                      <h4 className="font-medium">{area.title} Recommendations</h4>
                      <Badge variant={getStatusBadgeVariant(area.feedback.status)} className="ml-auto">
                        {getStatusLabel(area.feedback.status)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {area.feedback.suggestions.map((suggestion: string, suggestionIndex: number) => (
                        <div 
                          key={suggestionIndex} 
                          className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-muted-foreground text-background rounded-full flex items-center justify-center text-xs font-medium">
                            {suggestionIndex + 1}
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
