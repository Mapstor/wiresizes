'use client';

// Google Analytics 4 behind consent. Consent Mode v2 defaults are set before anything loads: ad signals always
// denied, analytics_storage denied. A stored choice (localStorage "ws-consent") decides; without one, visitors
// from the EU, the EEA, the UK and Switzerland (or with no country header) see the banner and nothing loads until
// "Accept analytics"; everyone else gets Google Analytics with analytics_storage granted. "Cookie settings" in the
// footer reopens the banner for every visitor. Banner copy from research/trust-pages-copy.md ("Cookie banner").
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const MEASUREMENT_ID = 'G-T871GVJZE2';
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const CHOICE_KEY = 'ws-consent';
const REGION_KEY = 'ws-consent-region';
const OPEN_EVENT = 'ws-open-cookie-settings';
const GA_COOKIES = ['_ga', `_ga_${MEASUREMENT_ID.slice(2)}`];

type Choice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readStorage(storage: 'local' | 'session', key: string): string | null {
  try {
    return (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: 'local' | 'session', key: string, value: string): void {
  try {
    (storage === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    // storage unavailable: the choice lasts for this page view only
  }
}

function gtag(...args: unknown[]): void {
  window.gtag?.(...args);
}

/** Consent Mode v2 defaults, before any Google script loads. */
function setConsentDefaults(): void {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtagShim() {
    // gtag.js reads the arguments object itself
    window.dataLayer!.push(arguments);
  };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

let gaLoaded = false;

function loadAnalytics(): void {
  gtag('consent', 'update', { analytics_storage: 'granted' });
  (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = false;
  if (gaLoaded) return;
  gaLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = GTAG_SRC;
  document.head.appendChild(script);
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
}

function stopAnalytics(): void {
  gtag('consent', 'update', { analytics_storage: 'denied' });
  if (gaLoaded) (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  const domains = [undefined, '.wiresizes.com', window.location.hostname];
  for (const name of GA_COOKIES) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

/** true: the banner must ask first; false: analytics may run. Local test override: ?consent-region=eu|other. */
async function regionNeedsConsent(): Promise<boolean> {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    const override = new URLSearchParams(window.location.search).get('consent-region');
    if (override === 'eu') return true;
    if (override === 'other') return false;
  }
  const cached = readStorage('session', REGION_KEY);
  if (cached === 'true' || cached === 'false') return cached === 'true';
  try {
    const response = await fetch('/api/consent-region', { cache: 'no-store' });
    const data = (await response.json()) as { consent?: unknown };
    const consent = data.consent !== false;
    writeStorage('session', REGION_KEY, String(consent));
    return consent;
  } catch {
    return true;
  }
}

export function Consent() {
  const [showBanner, setShowBanner] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConsentDefaults();
    const open = () => setShowBanner(true);
    window.addEventListener(OPEN_EVENT, open);
    let active = true;
    const stored = readStorage('local', CHOICE_KEY);
    if (stored === 'granted') {
      loadAnalytics();
    } else if (stored !== 'denied') {
      regionNeedsConsent().then((needsConsent) => {
        if (!active) return;
        if (needsConsent) setShowBanner(true);
        else loadAnalytics();
      });
    }
    return () => {
      active = false;
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, []);

  // Pad the page by the banner's height while it shows, so it never covers the footer
  useEffect(() => {
    const banner = bannerRef.current;
    if (!showBanner || !banner) return;
    const pad = () => {
      document.body.style.paddingBottom = `${banner.offsetHeight}px`;
    };
    pad();
    const observer = new ResizeObserver(pad);
    observer.observe(banner);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [showBanner]);

  const choose = useCallback((choice: Choice) => {
    writeStorage('local', CHOICE_KEY, choice);
    if (choice === 'granted') loadAnalytics();
    else stopAnalytics();
    setShowBanner(false);
  }, []);

  if (!showBanner) return null;

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label="Cookie choice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-300 bg-white shadow-lg"
    >
      <div className="container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-800">
          {"We'd like to use Google Analytics cookies to see which pages people read."}{' '}
          <Link href="/privacy" className="text-blue-700 underline">
            Privacy notice
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-3 sm:w-80">
          <button
            type="button"
            onClick={() => choose('granted')}
            className="w-full rounded-lg border border-neutral-400 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => choose('denied')}
            className="w-full rounded-lg border border-neutral-400 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer button that reopens the cookie banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
