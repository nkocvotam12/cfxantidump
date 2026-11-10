// src/components/ui/UiText.tsx
'use client';
import { useUiText } from '@/hooks/useUiText';

export function UiText({ text }: { text: string }) {
  const translate = useUiText();
  return <>{translate(text)}</>;
}