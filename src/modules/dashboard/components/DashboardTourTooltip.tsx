import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Step, TooltipRenderProps } from 'react-joyride';
import { cn } from '@/lib/utils';

interface DashboardTourTooltipProps extends TooltipRenderProps {
  language: 'en' | 'ar';
  locale?: {
    back?: string;
    close?: string;
    last?: string;
    next?: string;
    skip?: string;
  };
  onDontShowAgain?: (checked: boolean) => void;
}

export function DashboardTourTooltip({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  closeProps,
  skipProps,
  primaryProps,
  tooltipProps,
  locale,
  language,
  onDontShowAgain,
}: DashboardTourTooltipProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const isRTL = language === 'ar';

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (onDontShowAgain) {
      onDontShowAgain(checked);
    }
  };

  // Get locale strings
  const localeStrings = {
    back: locale?.back || (isRTL ? 'السابق' : 'Back'),
    close: locale?.close || (isRTL ? 'إغلاق' : 'Close'),
    last: locale?.last || (isRTL ? 'إنهاء' : 'Finish'),
    next: locale?.next || (isRTL ? 'التالي' : 'Next'),
    skip: locale?.skip || (isRTL ? 'تخطّي' : 'Skip'),
  };

  return (
    <AnimatePresence>
      <motion.div
        {...tooltipProps}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'relative z-[10000]',
          isRTL && 'rtl'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Card
          className={cn(
            'w-full max-w-sm p-6 shadow-2xl border-2',
            'bg-background/95 backdrop-blur-sm',
            'rounded-2xl', // Fancy rounded corners
            'border-border/40',
            'dark:border-border/60'
          )}
        >
          {/* Close button */}
          <button
            {...closeProps}
            className={cn(
              'absolute top-4 right-4 p-1.5 rounded-lg',
              'hover:bg-accent transition-colors',
              'text-muted-foreground hover:text-foreground',
              isRTL && 'right-auto left-4'
            )}
            aria-label={localeStrings.close}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="pr-8 space-y-4">
            {step.title && (
              <h3 className={cn(
                'text-lg font-semibold text-foreground',
                'leading-tight'
              )}>
                {step.title}
              </h3>
            )}
            <div className={cn(
              'text-sm text-muted-foreground',
              'leading-relaxed'
            )}>
              {step.content}
            </div>
          </div>

          {/* Don't show again checkbox - only show on first step */}
          {index === 0 && (
            <div className={cn(
              'mt-4 pt-4 border-t border-border/40',
              'flex items-center space-x-2',
              isRTL && 'space-x-reverse'
            )}>
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={handleDontShowAgainChange}
                className="rounded-md"
              />
              <Label
                htmlFor="dont-show-again"
                className={cn(
                  'text-xs text-muted-foreground cursor-pointer',
                  'select-none leading-tight'
                )}
              >
                {isRTL 
                  ? 'لا تظهر لي هذا مرة أخرى'
                  : "Don't show this tour again"
                }
              </Label>
            </div>
          )}

          {/* Actions */}
          <div className={cn(
            'mt-6 flex items-center gap-2',
            isRTL ? 'flex-row-reverse' : 'flex-row'
          )}>
            {index > 0 && (
              <Button
                {...backProps}
                variant="outline"
                size="sm"
                className={cn(
                  'rounded-lg flex-1',
                  'transition-all hover:scale-105'
                )}
              >
                {isRTL ? (
                  <>
                    {localeStrings.back}
                    <ChevronRight className="h-4 w-4 mr-1" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4 ml-1" />
                    {localeStrings.back}
                  </>
                )}
              </Button>
            )}
            
            {continuous && !isLastStep && (
              <Button
                {...primaryProps}
                size="sm"
                className={cn(
                  'rounded-lg flex-1',
                  'bg-primary hover:bg-primary/90',
                  'transition-all hover:scale-105',
                  'shadow-md'
                )}
              >
                {isRTL ? (
                  <>
                    {localeStrings.next}
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </>
                ) : (
                  <>
                    {localeStrings.next}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}

            {isLastStep && (
              <Button
                {...primaryProps}
                size="sm"
                className={cn(
                  'rounded-lg flex-1',
                  'bg-primary hover:bg-primary/90',
                  'transition-all hover:scale-105',
                  'shadow-md'
                )}
              >
                {localeStrings.last}
              </Button>
            )}

            {!isLastStep && (
              <Button
                {...skipProps}
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-lg',
                  'text-muted-foreground hover:text-foreground',
                  'transition-all'
                )}
              >
                {localeStrings.skip}
              </Button>
            )}
          </div>

          {/* Progress indicator removed - react-joyride doesn't provide step count in TooltipRenderProps */}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

