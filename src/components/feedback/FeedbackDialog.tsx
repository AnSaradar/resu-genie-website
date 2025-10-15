import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Send, X } from 'lucide-react';
import { useSubmitFeedback } from '@/services/feedback/hook';
import { FeedbackFeature, FeedbackRating, TAG_DISPLAY_NAMES, COVER_LETTER_TAGS, JOB_MATCH_TAGS } from '@/services/feedback/types';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeedbackFeature;
  artifactId?: string;
  traceId?: string;
  inputSnapshot?: Record<string, any>;
  outputSnapshotText?: string;
  outputSnapshotJson?: Record<string, any>;
}

type Step = 'rating' | 'details';

export default function FeedbackDialog({
  isOpen,
  onClose,
  feature,
  artifactId,
  traceId,
  inputSnapshot,
  outputSnapshotText,
  outputSnapshotJson,
}: FeedbackDialogProps) {
  const [step, setStep] = useState<Step>('rating');
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const submitFeedback = useSubmitFeedback();

  // Get available tags based on feature
  const availableTags = feature === 'cover_letter' ? COVER_LETTER_TAGS : JOB_MATCH_TAGS;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('rating');
        setRating(null);
        setSelectedTags([]);
        setNote('');
      }, 300); // Wait for dialog close animation
    }
  }, [isOpen]);

  const handleRatingSelect = async (selectedRating: FeedbackRating) => {
    setRating(selectedRating);
    
    // If thumb up (positive feedback), submit immediately without asking for more details
    if (selectedRating === 1) {
      try {
        await submitFeedback.mutateAsync({
          artifact_id: artifactId,
          trace_id: traceId,
          feature,
          rating: selectedRating,
          tags: [],
          note: undefined,
          input_snapshot: inputSnapshot,
          output_snapshot_text: outputSnapshotText,
          output_snapshot_json: outputSnapshotJson,
          ui_version: 'v1.0.0',
        });
        onClose();
      } catch (error) {
        // Error is handled by the mutation hook
        console.error('Failed to submit feedback:', error);
      }
    } else {
      // If thumb down (negative feedback), show details step for more context
      setTimeout(() => setStep('details'), 300);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!rating) return;

    try {
      await submitFeedback.mutateAsync({
        artifact_id: artifactId,
        trace_id: traceId,
        feature,
        rating,
        tags: selectedTags,
        note: note.trim() || undefined,
        input_snapshot: inputSnapshot,
        output_snapshot_text: outputSnapshotText,
        output_snapshot_json: outputSnapshotJson,
        ui_version: 'v1.0.0',
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'rating' ? 'How was this result?' : 'Tell us more (optional)'}
          </DialogTitle>
          <DialogDescription>
            {step === 'rating'
              ? 'Your feedback helps us improve the AI. Positive feedback submits instantly!'
              : 'Help us understand what could be better'}
          </DialogDescription>
        </DialogHeader>

        {step === 'rating' && (
          <div className="flex flex-col items-center gap-6 py-6">
            <p className="text-sm text-muted-foreground text-center">
              Was this {feature === 'cover_letter' ? 'cover letter' : 'job match'} helpful?
            </p>
            <div className="flex gap-6">
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-8 hover:bg-green-50 hover:border-green-500 transition-all"
                onClick={() => handleRatingSelect(1)}
              >
                <ThumbsUp className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium">Helpful</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-8 hover:bg-red-50 hover:border-red-500 transition-all"
                onClick={() => handleRatingSelect(-1)}
              >
                <ThumbsDown className="h-8 w-8 text-red-600" />
                <span className="text-sm font-medium">Not Helpful</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="mt-2">
              Skip
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6 py-4">
            {/* Rating indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {rating === 1 ? (
                <>
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span>Rated as helpful</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span>Rated as not helpful</span>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium">What should we focus on? (select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm cursor-pointer select-none"
                    >
                      {TAG_DISPLAY_NAMES[tag] || tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label htmlFor="feedback-note" className="text-sm font-medium">
                Additional comments (optional)
              </label>
              <Textarea
                id="feedback-note"
                placeholder="Share any specific thoughts or suggestions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={800}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {note.length}/800 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitFeedback.isPending}
                className="min-w-[120px]"
              >
                {submitFeedback.isPending ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

