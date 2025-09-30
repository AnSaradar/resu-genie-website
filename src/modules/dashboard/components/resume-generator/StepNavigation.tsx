import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextLabel: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
  nextLabel,
  nextDisabled = false,
  isLoading = false,
}: StepNavigationProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="flex justify-between px-6 py-0 pb-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="pointer-events-auto"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={nextDisabled || (isLastStep && nextDisabled) || isLoading}
          className="pointer-events-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            nextLabel
          )}
        </Button>
      </div>
    </div>
  );
} 