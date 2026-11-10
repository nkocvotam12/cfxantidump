export type Lang = 'en' | 'es' | 'vi';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

export interface TranslationDict {
  [key: string]: string;
}

export interface AntiSpamResult {
  isValid: boolean;
  reason?: string;
}
