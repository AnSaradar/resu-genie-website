import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, FileText, CheckCircle, Loader2, FileUp } from 'lucide-react';
import cvUploadService from '@/services/resume/cvUploadService';
import { toast } from 'react-hot-toast';
import { ResumeCreateRequest } from '@/services/resume/types';
import { useNavigate } from 'react-router-dom';
import { mapCVDataToFrontend } from '@/utils/cv-data-mapper';
import { ResumeData } from '@/modules/dashboard/pages/ResumeGenerator';
import { ResumePreview } from '@/modules/dashboard/components/resume-generator/ResumePreview';

interface CVUploadFormProps {
  onResumeCreated?: (resumeId: string) => void;
  onDataExtracted?: (data: ResumeData) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'extracted' | 'preview' | 'creating' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeCreateRequest | null>(null);
  const [frontendResumeData, setFrontendResumeData] = useState<ResumeData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
        setUploadStatus('error');
        return;
      }
      
      // Check file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 10MB limit.');
        setUploadStatus('error');
        return;
      }
      
      setFile(selectedFile);
      setErrorMessage('');
      setUploadStatus('idle');
    }
  };

  const handleUploadAndExtract = async () => {
    if (!file) {
      return;
    }
    
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      // Upload and extract in a single operation
      const result = await cvUploadService.uploadAndExtractCV(
        file, 
        undefined, // llmModel - can be made configurable later
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(progress);
          
          // Switch to extracting status when upload is complete
          if (progress === 100 && uploadStatus === 'uploading') {
            setUploadStatus('extracting');
          }
        }
      );
      
      setResumeData(result.resume_data);
      
      // Convert backend data to frontend format for preview
      const frontendData = mapCVDataToFrontend(result.resume_data);
      setFrontendResumeData(frontendData);
      
      setUploadStatus('preview');
      
      toast.success('CV Data Extracted Successfully! Review your information below.');
    } catch (error) {
      console.error('Error processing CV:', error);
      setErrorMessage('Failed to process CV file. Please try a different file or format.');
      setUploadStatus('error');
    }
  };

  const handleContinueWithData = () => {
    if (!frontendResumeData) {
      return;
    }
    
    // Push via navigation state (more reliable than sessionStorage)
    navigate('/dashboard/resume/new', { state: { cvExtractedData: frontendResumeData } });
    
    // Also store in sessionStorage as a fallback if user hard refreshes
    sessionStorage.setItem('cv-extracted-data', JSON.stringify(frontendResumeData));
    // Remove this toast since ResumeGenerator will show the success message
    // toast.success('Data saved! Redirecting to resume builder...');
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
    setResumeData(null);
    setFrontendResumeData(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Resume from CV</CardTitle>
        <CardDescription>
          Upload your existing CV to automatically extract and import your resume information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Visual header for consistency */}
        {uploadStatus === 'idle' && (
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
              <FileUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Upload Your Existing CV</h3>
              <p className="text-sm text-muted-foreground">
                We'll automatically extract and organize your information
              </p>
            </div>
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-800">
                <p className="font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {uploadStatus === 'idle' && (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                ref={fileInputRef}
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX. Max 10MB.</p>
            </div>
            
            {file && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
            )}
            
            <Button 
              onClick={handleUploadAndExtract} 
              disabled={!file}
              className="w-full gap-2"
              size="lg"
            >
              <Upload className="h-4 w-4" /> Upload & Extract Data
            </Button>
          </div>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'extracting' || uploadStatus === 'creating') && (
          <div className="space-y-4">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>
                {uploadStatus === 'uploading' ? 'Uploading your CV...' : 
                 uploadStatus === 'extracting' ? 'Extracting data from your CV...' :
                 'Creating your resume...'}
              </p>
            </div>
            
            {uploadStatus === 'uploading' && (
              <Progress value={uploadProgress} className="w-full" />
            )}
          </div>
        )}


        {uploadStatus === 'preview' && frontendResumeData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Extracted Resume Data</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Upload Different File
                </Button>
                <Button onClick={handleContinueWithData} className="gap-2" size="lg">
                  <FileText className="h-4 w-4" />
                  Continue to Resume Builder
                </Button>
              </div>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto border rounded-lg">
              <ResumePreview
                data={frontendResumeData}
                onUpdate={(data) => setFrontendResumeData(prev => prev ? { ...prev, ...data } : null)}
                onNext={() => {}}
                onPrevious={() => {}}
                isFirstStep={false}
                isLastStep={false}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {uploadStatus !== 'idle' && uploadStatus !== 'preview' && (
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        )}
        
        {uploadStatus === 'preview' && (
          <div className="text-sm text-muted-foreground">
            Review your extracted data above, then click "Continue to Resume Builder" to proceed.
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CVUploadForm;
