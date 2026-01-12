import { ReactNode, useEffect } from 'react';
import { useDirection } from '@/i18n/hooks';

interface DirectionProviderProps {
  children: ReactNode;
}

export function DirectionProvider({ children }: DirectionProviderProps) {
  const { dir, lang } = useDirection();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('dir', dir);
      html.setAttribute('lang', lang);
    }
  }, [dir, lang]);

  return <>{children}</>;
}




