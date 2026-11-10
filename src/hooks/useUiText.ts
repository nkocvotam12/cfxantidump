// src/hooks/useUiText.ts
'use client';

import { useLang } from './useLang';
import { lookupUiText } from '@/lib/uiText';

export { lookupUiText };

export function useUiText() {
  const { lang } = useLang();
  return (text: string) => lookupUiText(lang, text) ?? text;
}
