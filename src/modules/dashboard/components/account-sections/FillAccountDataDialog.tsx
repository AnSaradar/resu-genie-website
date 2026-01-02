import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Upload, 
  FileText, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  FileUp
} from 'lucide-react';
import cvUploadService from '@/services/resume/cvUploadService';
import { toast } from 'react-hot-toast';

interface FillAccountDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FillAccountDataDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: FillAccountDataDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'filling' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filledSummary, setFilledSummary] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessage('Unsupported file format. Please upload a PDF or Word document.');
        setStatus('error');
        return;
      }
      
      // Check file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 10MB limit.');
        setStatus('error');
        return;
      }
      
      setFile(selectedFile);
      setErrorMessage('');
      setStatus('idle');
    }
  };

  const handleFillAccountData = async () => {
    if (!file) {
      return;
    }
    
    try {
      setStatus('uploading');
      setUploadProgress(0);
      setErrorMessage('');
      
      // Upload and extract CV data
      const extractResult = await cvUploadService.uploadAndExtractCV(
        file, 
        undefined,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(progress);
          
          if (progress === 100 && status === 'uploading') {
            setStatus('extracting');
          }
        }
      );
      
      // Fill account data from extracted CV
      setStatus('filling');
      const fillResult = await cvUploadService.fillAccountDataFromCV(extractResult.resume_data);
      
      setFilledSummary(fillResult.summary);
      setStatus('success');
      
      // Show success message with summary
      const summary = fillResult.summary;
      const items = [
        summary.profile && 'Profile',
        summary.experiences > 0 && `${summary.experiences} Experience${summary.experiences > 1 ? 's' : ''}`,
        summary.education > 0 && `${summary.education} Education${summary.education > 1 ? ' entries' : ''}`,
        summary.skills > 0 && `${summary.skills} Skill${summary.skills > 1 ? 's' : ''}`,
        summary.languages > 0 && `${summary.languages} Language${summary.languages > 1 ? 's' : ''}`,
        summary.certifications > 0 && `${summary.certifications} Certification${summary.certifications > 1 ? 's' : ''}`,
        summary.links > 0 && `${summary.links} Link${summary.links > 1 ? 's' : ''}`,
        summary.personal_projects > 0 && `${summary.personal_projects} Project${summary.personal_projects > 1 ? 's' : ''}`
      ].filter(Boolean);
      
      toast.success(`Account data filled successfully! Added: ${items.join(', ')}`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error filling account data:', error);
      setErrorMessage('Failed to fill account data. Please try again.');
      setStatus('error');
      toast.error('Failed to fill account data. Please try again.');
    }
  };

  const handleClose = () => {
    if (status !== 'uploading' && status !== 'extracting' && status !== 'filling') {
      setFile(null);
      setUploadProgress(0);
      setStatus('idle');
      setErrorMessage('');
      setFilledSummary(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setStatus('idle');
    setErrorMessage('');
    setFilledSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Fill Account Data from CV</DialogTitle>
          <DialogDescription>
            Upload your CV to automatically extract and fill your account data sections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {status === 'idle' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <FileUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Upload Your CV</h4>
                  <p className="text-xs text-muted-foreground">
                    We'll extract and fill your account data automatically
                  </p>
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX. Max 10MB.
                </p>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-2 rounded border">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
              )}
            </div>
          )}

          {(status === 'uploading' || status === 'extracting' || status === 'filling') && (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm">
                  {status === 'uploading' ? 'Uploading your CV...' : 
                   status === 'extracting' ? 'Extracting data from your CV...' :
                   'Filling your account data...'}
                </p>
              </div>
              
              {status === 'uploading' && (
                <Progress value={uploadProgress} className="w-full" />
              )}
            </div>
          )}

          {status === 'success' && filledSummary && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">
                    Account Data Filled Successfully!
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Your account data has been updated with information from your CV.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <h5 className="font-semibold text-sm mb-2">Summary:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {filledSummary.profile && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Profile</span>
                    </div>
                  )}
                  {filledSummary.experiences > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.experiences} Experience{filledSummary.experiences > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filledSummary.education > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.education} Education{filledSummary.education > 1 ? ' entries' : ''}</span>
                    </div>
                  )}
                  {filledSummary.skills > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.skills} Skill{filledSummary.skills > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filledSummary.languages > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.languages} Language{filledSummary.languages > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filledSummary.certifications > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.certifications} Certification{filledSummary.certifications > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filledSummary.links > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.links} Link{filledSummary.links > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filledSummary.personal_projects > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{filledSummary.personal_projects} Project{filledSummary.personal_projects > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-800">
                  <p className="font-medium text-sm">Error</p>
                  <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {status === 'idle' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleFillAccountData} 
                disabled={!file}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Fill Account Data
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </>
          )}
          {status === 'success' && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
          {(status === 'uploading' || status === 'extracting' || status === 'filling') && (
            <Button disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


