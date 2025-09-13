import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface ResumeNamingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resumeName: string) => void;
  existingResumeNames: string[];
  defaultName?: string;
  isLoading?: boolean;
}

export function ResumeNamingDialog({
  isOpen,
  onClose,
  onConfirm,
  existingResumeNames = [],
  defaultName = '',
  isLoading = false,
}: ResumeNamingDialogProps) {
  const [resumeName, setResumeName] = useState(defaultName);
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setResumeName(defaultName || '');
      setValidationError('');
      setIsValid(false);
    }
  }, [isOpen, defaultName]);

  // Validate resume name in real-time
  useEffect(() => {
    if (!resumeName.trim()) {
      setValidationError('');
      setIsValid(false);
      return;
    }

    const cleanName = resumeName.trim();
    
    // Check length
    if (cleanName.length < 2) {
      setValidationError('Resume name must be at least 2 characters long');
      setIsValid(false);
      return;
    }

    if (cleanName.length > 100) {
      setValidationError('Resume name cannot exceed 100 characters');
      setIsValid(false);
      return;
    }

    // Check for invalid characters
    const invalidChars = ['<', '>', ':', '"', '|', '?', '*', '\\', '/'];
    const hasInvalidChar = invalidChars.some(char => cleanName.includes(char));
    
    if (hasInvalidChar) {
      setValidationError('Resume name contains invalid characters');
      setIsValid(false);
      return;
    }

    // Check if name already exists
    if (existingResumeNames.includes(cleanName)) {
      setValidationError('A resume with this name already exists');
      setIsValid(false);
      return;
    }

    setValidationError('');
    setIsValid(true);
  }, [resumeName, existingResumeNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && resumeName.trim()) {
      onConfirm(resumeName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleSubmit(e);
    }
  };

  const getSuggestedName = () => {
    if (!resumeName.trim()) return '';
    
    const cleanName = resumeName.trim();
    if (!existingResumeNames.includes(cleanName)) return '';
    
    // Find the next available number
    let counter = 1;
    while (counter <= 10) { // Limit to 10 suggestions
      const candidate = `${cleanName} (${counter})`;
      if (!existingResumeNames.includes(candidate)) {
        return candidate;
      }
      counter++;
    }
    return '';
  };

  const suggestedName = getSuggestedName();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Name Your Resume
          </DialogTitle>
          <DialogDescription>
            Choose a name for your resume. This will help you identify it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-name">Resume Name</Label>
            <div className="relative">
              <Input
                id="resume-name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter resume name..."
                className={`pr-10 ${validationError ? 'border-red-500' : isValid ? 'border-green-500' : ''}`}
                disabled={isLoading}
                autoFocus
              />
              {isValid && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {validationError && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
            
            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Suggestion for duplicate names */}
            {suggestedName && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Suggested name:</span>{' '}
                <button
                  type="button"
                  onClick={() => setResumeName(suggestedName)}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  {suggestedName}
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                'Save & Download'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
