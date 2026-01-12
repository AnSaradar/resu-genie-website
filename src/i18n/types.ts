import type common from '@/locales/en/common.json';
import type landing from '@/locales/en/landing.json';
import { Namespace } from './constants';

// Helper to convert a nested JSON object to dot-notation keys
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = {
  [K in keyof T & (string | number)]: T[K] extends Record<string, any>
    ? T[K] extends Array<any>
      ? K
      : K | Join<K, Paths<T[K]>>
    : K;
}[keyof T & (string | number)];

export type CommonKey = Paths<typeof common>;
export type LandingKey = Paths<typeof landing>;

export type TranslationKey<N extends Namespace = 'common' | 'landing'> =
  N extends 'common'
    ? CommonKey
    : N extends 'landing'
      ? LandingKey
      : string;




