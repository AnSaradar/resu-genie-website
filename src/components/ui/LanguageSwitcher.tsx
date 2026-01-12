import { useCallback } from 'react';
import { useAppTranslation } from '@/i18n/hooks';
import { SupportedLanguage } from '@/i18n/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type LanguageSwitcherVariant = 'dropdown' | 'toggle' | 'icon';

interface LanguageSwitcherProps {
  variant?: LanguageSwitcherVariant;
}

const LANGUAGE_LABEL: Record<SupportedLanguage, string> = {
  en: 'English',
  ar: 'العربية',
};

export function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const { t, language, changeLanguage } = useAppTranslation('common');

  const handleChange = useCallback(
    (lng: SupportedLanguage) => {
      if (lng !== language) {
        changeLanguage(lng);
        try {
          localStorage.setItem('locale', lng);
        } catch {
          // ignore
        }
      }
    },
    [changeLanguage, language],
  );

  if (variant === 'toggle') {
    const nextLang: SupportedLanguage = language === 'en' ? 'ar' : 'en';
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label={LANGUAGE_LABEL[nextLang]}
        onClick={() => handleChange(nextLang)}
      >
        <span className="text-xs font-medium">{language === 'en' ? 'EN' : 'AR'}</span>
      </Button>
    );
  }

  if (variant === 'icon') {
    const isEn = language === 'en';
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={LANGUAGE_LABEL[language]}
        onClick={() => handleChange(isEn ? 'ar' : 'en')}
      >
        <span className="text-xs font-semibold">{isEn ? 'EN' : 'AR'}</span>
      </Button>
    );
  }

  // Default: dropdown - matches theme switcher pattern
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-3">
        <span className="text-xs font-medium uppercase">{language === 'en' ? 'EN' : 'AR'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['en', 'ar'] as SupportedLanguage[]).map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => handleChange(lng)}
            className={lng === language ? 'font-semibold' : ''}
          >
            <span className="mr-2 text-xs uppercase">{lng.toUpperCase()}</span>
            <span>{LANGUAGE_LABEL[lng]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



