// src/hooks/useCookieConsent.ts
'use client';

import { useEffect, useState } from 'react';
import { CookieConsent } from '@/types';

const STORAGE_KEY = 'cfx_cookie_consent_v1';

export function getCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(prefs: { analytics: boolean; preferences: boolean }): CookieConsent {
  const data: CookieConsent = {
    necessary: true,
    analytics: !!prefs.analytics,
    preferences: !!prefs.preferences,
    timestamp: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.cookie = `cfx_cookie_consent=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    window.dispatchEvent(new CustomEvent('cfx-cookie-consent-updated', { detail: data }));
  } catch (e) {
    console.error('Error saving cookie preferences', e);
  }
  return data;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing) {
      setConsent(existing);
      setAnalytics(existing.analytics);
      setPreferences(existing.preferences);
    } else {
      const t = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const c = getCookieConsent();
      if (c) {
        setAnalytics(c.analytics);
        setPreferences(c.preferences);
        setConsent(c);
      }
      setShowBanner(true);
      setCustomizing(true);
    };
    window.addEventListener('open-cookie-banner', handler);
    return () => window.removeEventListener('open-cookie-banner', handler);
  }, []);

  const save = (prefs: { analytics: boolean; preferences: boolean }) => {
    const data = saveCookieConsent(prefs);
    setConsent(data);
    setShowBanner(false);
    setCustomizing(false);
  };

  return {
    consent,
    showBanner,
    customizing,
    setCustomizing,
    analytics,
    setAnalytics,
    preferences,
    setPreferences,
    save,
    hideBanner: () => setShowBanner(false),
  };
}