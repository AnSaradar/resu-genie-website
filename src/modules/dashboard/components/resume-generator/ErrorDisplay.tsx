import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string | null;
  isLoading?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  isLoading = false, 
  onDismiss,
  className = "" 
}: ErrorDisplayProps) {
  if (!error && !isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 left-4 right-4 z-[9999] ${className}`}
      >
        <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg shadow-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Processing your request...</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Please wait while we save and download your resume.
                  </p>
                </div>
              ) : (
                <div className="text-red-800 dark:text-red-200">
                  <p className="font-medium">Error occurred</p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1 whitespace-pre-line">
                    {error}
                  </p>
                </div>
              )}
            </div>
            
            {onDismiss && !isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
