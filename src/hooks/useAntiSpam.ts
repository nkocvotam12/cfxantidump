// src/hooks/useAntiSpam.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AntiSpamResult } from '@/types';

export function useAntiSpam(minSeconds = 0.8, cooldownMs = 3000) {
  const [honeypotValue, setHoneypotValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const mountedAt = useRef(Date.now());
  const lastSubmit = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const id = setInterval(() => setCooldownRemaining((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldownRemaining]);

  const validateSubmission = useCallback((): AntiSpamResult => {
    const now = Date.now();

    if (honeypotValue.trim().length > 0) {
      console.warn('[AntiSpam] Honeypot triggered');
      return { isValid: false, reason: 'Automated submission detected.' };
    }

    const elapsed = (now - mountedAt.current) / 1000;
    if (elapsed < minSeconds) {
      console.warn(`[AntiSpam] Too fast: ${elapsed.toFixed(2)}s`);
      return { isValid: false, reason: 'Submission too rapid. Please try again.' };
    }

    if (lastSubmit.current > 0 && now - lastSubmit.current < cooldownMs) {
      const secs = Math.ceil((cooldownMs - (now - lastSubmit.current)) / 1000);
      return { isValid: false, reason: `Please wait ${secs}s before submitting again.` };
    }

    lastSubmit.current = now;
    return { isValid: true };
  }, [honeypotValue, minSeconds, cooldownMs]);

  const startCooldown = () => setCooldownRemaining(Math.ceil(cooldownMs / 1000));

  return {
    honeypotValue,
    setHoneypotValue,
    validateSubmission,
    isSubmitting,
    setIsSubmitting,
    cooldownRemaining,
    startCooldown,
  };
}