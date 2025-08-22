import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextLabel: string;
  nextDisabled?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
  nextLabel,
  nextDisabled = false,
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
          disabled={nextDisabled || (isLastStep && nextDisabled)}
          className="pointer-events-auto"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
} 