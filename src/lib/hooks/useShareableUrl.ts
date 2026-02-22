'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useShareableUrl<T extends Record<string, string | number | boolean>>(
  inputs: T,
  options?: { debounceMs?: number; enabled?: boolean }
) {
  const pathname = usePathname();
  const router = useRouter();
  const { debounceMs = 300, enabled = true } = options ?? {};

  useEffect(() => {
    if (!enabled) return;
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      Object.entries(inputs).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    }, debounceMs);
    return () => clearTimeout(timeoutId);
  }, [inputs, pathname, router, debounceMs, enabled]);

  const getShareableUrl = (): string => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wiresizes.com';
    return `${baseUrl}${pathname}?${params.toString()}`;
  };

  return { getShareableUrl };
}