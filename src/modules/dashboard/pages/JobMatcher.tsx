import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useCreateJobMatch, useJobMatchHistory } from '@/services/job_match/hook';
import { useQuery } from '@tanstack/react-query';
import { fetchMyResumes } from '@/services/resume/service';
import { ResumeListResponse } from '@/services/resume/types';
import { JobMatch } from '@/services/job_match/types';
import { Sparkles, ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, ListChecks, Target, TrendingUp, Award, BookOpen, X } from 'lucide-react';

export default function JobMatcher() {
  const navigate = useNavigate();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobOfferText, setJobOfferText] = useState('');
  const [page, setPage] = useState(1);
  const [currentMatch, setCurrentMatch] = useState<JobMatch | null>(null);

  const createJobMatch = useCreateJobMatch();
  const { data: history, isLoading: historyLoading } = useJobMatchHistory(page, 10);
  const { data: resumes } = useQuery<ResumeListResponse>({
    queryKey: ['my-resumes'],
    queryFn: fetchMyResumes,
    staleTime: 5 * 60 * 1000,
  });

  const resumeOptions = useMemo(() => resumes?.data.resumes ?? [], [resumes]);

  const handleMatch = async () => {
    if (!selectedResumeId || !jobOfferText.trim()) return;
    try {
      const result = await createJobMatch.mutateAsync({
        resume_id: selectedResumeId,
        job_offer_text: jobOfferText,
        job_title: jobTitle || undefined,
      });
      setCurrentMatch(result.job_match);
      setPage(1);
    } catch (error) {
      console.error('Job match failed:', error);
    }
  };

  const clearCurrentMatch = () => {
    setCurrentMatch(null);
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-violet-600" />
            Job Matcher
          </h1>
          <p className="text-muted-foreground mt-2">
            Paste a job posting and see how well your resume fits. Get targeted advice.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Posting</CardTitle>
            <CardDescription>Paste the full text for best results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Optional: Job Title (e.g., Senior Backend Engineer)" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Textarea placeholder="Paste the job description, responsibilities, and requirements here..." value={jobOfferText} onChange={(e) => setJobOfferText(e.target.value)} className="min-h-[240px]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Select which resume to compare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(v) => setSelectedResumeId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumeOptions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.resume_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="w-full" size="lg" disabled={createJobMatch.isPending || !selectedResumeId || !jobOfferText.trim()} onClick={handleMatch}>
              {createJobMatch.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Matching...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Match Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Match Results */}
      {currentMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Target className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Match Results</CardTitle>
                    <CardDescription>
                      {currentMatch.job_title || 'Untitled Role'} • {new Date(currentMatch.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearCurrentMatch}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score and Recommendation */}
              <div className="text-center">
                <div className="text-4xl font-bold text-violet-600 mb-2">
                  {currentMatch.overall_score ? Math.round(currentMatch.overall_score) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Overall Match Score</div>
                {currentMatch.overall_score && (
                  <Progress value={currentMatch.overall_score} className="mt-2 h-2" />
                )}
                
                {/* Should Apply Recommendation */}
                {currentMatch.should_apply && (
                  <div className="mt-4">
                    {currentMatch.should_apply === 'yes' ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-semibold">Recommended to Apply</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full">
                        <X className="h-4 w-4" />
                        <span className="font-semibold">Not Recommended</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  label="Skills"
                  score={currentMatch.skills_score}
                  color="blue"
                />
                <ScoreCard
                  icon={<Award className="h-5 w-5" />}
                  label="Experience"
                  score={currentMatch.experience_score}
                  color="orange"
                />
                <ScoreCard
                  icon={<BookOpen className="h-5 w-5" />}
                  label="Education"
                  score={currentMatch.education_score}
                  color="green"
                />
                <ScoreCard
                  icon={<Target className="h-5 w-5" />}
                  label="Overall"
                  score={currentMatch.overall_score}
                  color="violet"
                />
              </div>

              {/* Strong Matching Points */}
              {currentMatch.strong_matching_points && currentMatch.strong_matching_points.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                    <Award className="h-5 w-5" />
                    Key Strengths
                  </h4>
                  <div className="space-y-2">
                    {currentMatch.strong_matching_points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Skills */}
              {currentMatch.matched_skills && currentMatch.matched_skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Skills Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentMatch.matched_skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          {skill.present_in_resume ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Present
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <X className="h-3 w-3 mr-1" />
                              Missing
                            </Badge>
                          )}
                          {skill.confidence && (
                            <span className="text-xs text-muted-foreground">
                              {Math.round(skill.confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Requirements */}
              {currentMatch.missing_core_requirements && currentMatch.missing_core_requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    Missing Core Requirements
                  </h4>
                  <div className="space-y-2">
                    {currentMatch.missing_core_requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {currentMatch.recommendations && currentMatch.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                    <ListChecks className="h-5 w-5" />
                    Recommendations
                  </h4>
                  <div className="space-y-3">
                    {currentMatch.recommendations
                      .sort((a, b) => a.priority - b.priority)
                      .map((rec, idx) => (
                        <div key={idx} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-emerald-800 dark:text-emerald-200">{rec.requirement}</span>
                            <Badge variant="outline" className="text-xs">
                              Priority {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-emerald-700 dark:text-emerald-300">{rec.advice}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>See latest scores and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="text-sm text-muted-foreground">Loading history...</div>
          ) : history && history.items.length > 0 ? (
            <div className="space-y-4">
              {history.items.map((item) => (
                <div key={item._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString()}</div>
                      <div className="font-medium">{item.job_title || 'Untitled Role'}</div>
                      {item.should_apply && (
                        <div className="flex items-center gap-2">
                          {item.should_apply === 'yes' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                              <X className="h-3 w-3 mr-1" />
                              Not Recommended
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <ScorePill label="Overall" value={item.overall_score} />
                      <ScorePill label="Skills" value={item.skills_score} />
                      <ScorePill label="Experience" value={item.experience_score} />
                      <ScorePill label="Education" value={item.education_score} />
                    </div>
                  </div>

                  {item.missing_core_requirements?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Missing core requirements
                      </div>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        {item.missing_core_requirements.slice(0, 5).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.recommendations?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <ListChecks className="h-4 w-4" />
                        Top recommendations
                      </div>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        {item.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx}><span className="font-medium">{rec.requirement}:</span> {rec.advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <div className="text-sm text-muted-foreground">Page {history.page} of {history.total_pages}</div>
                <Button variant="outline" disabled={history.page >= history.total_pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No matches yet. Run your first match above.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScoreCard({ icon, label, score, color }: { icon: React.ReactNode; label: string; score?: number; color: string }) {
  if (typeof score !== 'number') return null;
  
  const colorClasses = {
    blue: 'text-blue-600',
    orange: 'text-orange-600', 
    green: 'text-green-600',
    violet: 'text-violet-600'
  };
  
  const bgColorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    green: 'bg-green-50 dark:bg-green-900/20', 
    violet: 'bg-violet-50 dark:bg-violet-900/20'
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColorClasses[color as keyof typeof bgColorClasses]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses[color as keyof typeof colorClasses]}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
        {Math.round(score)}
      </div>
      <Progress value={score} className="mt-2 h-1" />
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value?: number }) {
  if (typeof value !== 'number') return null;
  const color = value >= 75 ? 'text-emerald-700' : value >= 50 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${color}`}>{Math.round(value)}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}


