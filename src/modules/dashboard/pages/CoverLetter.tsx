import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCreateCoverLetter, useCoverLetterHistory } from '@/services/cover_letter/hook';
import { useQuery } from '@tanstack/react-query';
import { fetchMyResumes } from '@/services/resume/service';
import { ResumeListResponse } from '@/services/resume/types';
import { CoverLetter, CoverLetterTone } from '@/services/cover_letter/types';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';

import { FileText, ArrowLeft, RefreshCw, Copy, Download, Eye, Clock, Building, User, CheckCircle2, X } from 'lucide-react';

export default function CoverLetterPage() {
  // Add error boundary and console log for debugging
  console.log('CoverLetterPage component is rendering');
  
  const navigate = useNavigate();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManagerName, setHiringManagerName] = useState('');
  const [tone, setTone] = useState<CoverLetterTone>(CoverLetterTone.PROFESSIONAL);
  const [page, setPage] = useState(1);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);
  
  // Feedback dialog state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackInputSnapshot, setFeedbackInputSnapshot] = useState<Record<string, any> | undefined>();

  const createCoverLetter = useCreateCoverLetter();
  const { data: history, isLoading: historyLoading } = useCoverLetterHistory(page, 10);
  const { data: resumes } = useQuery<ResumeListResponse>({
    queryKey: ['my-resumes'],
    queryFn: fetchMyResumes,
    staleTime: 5 * 60 * 1000,
  });

  const resumeOptions = useMemo(() => resumes?.data.resumes ?? [], [resumes]);

  // Auto-open feedback dialog 10 seconds after successful generation
  useEffect(() => {
    if (!currentCoverLetter) return;

    const timer = setTimeout(() => {
      setIsFeedbackOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [currentCoverLetter]);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    try {
      // Capture input snapshot for feedback
      const inputSnapshot = {
        resume_id: selectedResumeId || 'account_data',
        job_title: jobTitle,
        job_description: jobDescription.substring(0, 500), // Truncate for storage
        company_name: companyName,
        hiring_manager_name: hiringManagerName,
        tone: tone,
      };
      setFeedbackInputSnapshot(inputSnapshot);
      
      const result = await createCoverLetter.mutateAsync({
        resume_id: selectedResumeId || undefined,
        job_title: jobTitle,
        job_description: jobDescription,
        company_name: companyName || undefined,
        hiring_manager_name: hiringManagerName || undefined,
        tone: tone,
      });
      setCurrentCoverLetter(result.cover_letter);
      setPage(1);
      
      // Clear form fields after successful generation
      setJobTitle('');
      setJobDescription('');
      setCompanyName('');
      setHiringManagerName('');
      setSelectedResumeId(null);
      setTone(CoverLetterTone.PROFESSIONAL);
    } catch (error) {
      console.error('Cover letter generation failed:', error);
    }
  };

  const clearCurrentCoverLetter = () => {
    setCurrentCoverLetter(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadCoverLetter = (coverLetter: CoverLetter) => {
    const blob = new Blob([coverLetter.cover_letter_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${coverLetter.job_title?.replace(/[^a-zA-Z0-9]/g, '-') || 'cover-letter'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getToneColor = (tone?: CoverLetterTone) => {
    switch (tone) {
      case CoverLetterTone.PROFESSIONAL: return 'bg-blue-100 text-blue-800';
      case CoverLetterTone.CREATIVE: return 'bg-purple-100 text-purple-800';
      case CoverLetterTone.ENTHUSIASTIC: return 'bg-orange-100 text-orange-800';
      case CoverLetterTone.CONFIDENT: return 'bg-green-100 text-green-800';
      case CoverLetterTone.FRIENDLY: return 'bg-pink-100 text-pink-800';
      case CoverLetterTone.FORMAL: return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Cover Letter Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate tailored cover letters using AI based on your resume and job requirements
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>Provide details about the position you're applying for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Job Title (e.g., Software Engineer)" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)} 
              />
              <Input 
                placeholder="Company Name (optional)" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
            <Input 
              placeholder="Hiring Manager Name (optional)" 
              value={hiringManagerName} 
              onChange={(e) => setHiringManagerName(e.target.value)} 
            />
            <Textarea 
              placeholder="Paste the job description, responsibilities, and requirements here..." 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)} 
              className="min-h-[240px]" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resume & Style</CardTitle>
            <CardDescription>Select resume and choose tone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Resume (Optional)</label>
              <Select onValueChange={(v) => setSelectedResumeId(v === "account-data" ? null : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Use account data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account-data">Use account data</SelectItem>
                  {resumeOptions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.resume_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedResumeId ? 'Using selected resume' : 'Using all account data'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <Select value={tone} onValueChange={(v: CoverLetterTone) => setTone(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CoverLetterTone.PROFESSIONAL}>Professional</SelectItem>
                  <SelectItem value={CoverLetterTone.CREATIVE}>Creative</SelectItem>
                  <SelectItem value={CoverLetterTone.ENTHUSIASTIC}>Enthusiastic</SelectItem>
                  <SelectItem value={CoverLetterTone.CONFIDENT}>Confident</SelectItem>
                  <SelectItem value={CoverLetterTone.FRIENDLY}>Friendly</SelectItem>
                  <SelectItem value={CoverLetterTone.FORMAL}>Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              disabled={createCoverLetter.isPending || !jobDescription.trim()} 
              onClick={handleGenerate}
            >
              {createCoverLetter.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Cover Letter Results */}
      {currentCoverLetter && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Generated Cover Letter
                  </CardTitle>
                  <CardDescription>
                    For {currentCoverLetter.job_title} at {currentCoverLetter.company_name || 'the company'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={clearCurrentCoverLetter}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getToneColor(currentCoverLetter.tone)}>
                  {currentCoverLetter.tone || 'professional'}
                </Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(currentCoverLetter.created_at).toLocaleDateString()}
                </Badge>
                {currentCoverLetter.company_name && (
                  <Badge variant="outline">
                    <Building className="mr-1 h-3 w-3" />
                    {currentCoverLetter.company_name}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(currentCoverLetter.cover_letter_content)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadCoverLetter(currentCoverLetter)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {currentCoverLetter.cover_letter_content}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History */}
      {history && history.items.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Cover Letters</h2>
            <Badge variant="outline">
              {history.total} total
            </Badge>
          </div>

          <div className="grid gap-4">
            {history.items.map((coverLetter) => (
              <Card key={coverLetter._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{coverLetter.job_title}</h3>
                        <Badge className={getToneColor(coverLetter.tone)}>
                          {coverLetter.tone || 'professional'}
                        </Badge>
                      </div>
                      {coverLetter.company_name && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {coverLetter.company_name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(coverLetter.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {coverLetter.cover_letter_content.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(coverLetter.cover_letter_content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadCoverLetter(coverLetter)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {history.total_pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                Page {page} of {history.total_pages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === history.total_pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Feedback Dialog */}
      {currentCoverLetter && (
        <FeedbackDialog
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          feature="cover_letter"
          artifactId={currentCoverLetter.artifact_id}
          traceId={currentCoverLetter.trace_id}
          inputSnapshot={feedbackInputSnapshot}
          outputSnapshotText={currentCoverLetter.cover_letter_content.substring(0, 2000)}
        />
      )}
    </motion.div>
  );
}
