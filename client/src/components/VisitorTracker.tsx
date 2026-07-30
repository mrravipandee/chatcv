'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePathRef = useRef(pathname);
  activePathRef.current = pathname;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Resolve or create Client Session ID
    let sessionId = localStorage.getItem('chatcv_session_id');
    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem('chatcv_session_id', sessionId);
    }

    // 2. Resolve UTM parameters
    const utmSource = searchParams.get('utm_source') || undefined;
    const utmMedium = searchParams.get('utm_medium') || undefined;
    const utmCampaign = searchParams.get('utm_campaign') || undefined;

    // 3. Resolve metadata details
    const referrer = document.referrer || 'Direct';
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language;
    const darkMode = document.documentElement.classList.contains('dark');
    
    // Resolve connection
    const conn = (navigator as any).connection;
    const connectionType = conn ? conn.effectiveType || 'Wifi' : 'Wifi';

    // Helper to send tracking ping
    const track = async (action: 'Page View' | 'Click' | 'Scroll' | 'Sign Up', detail?: string, scrollVal?: number) => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        await fetch(`${API_BASE_URL}/api/visitors/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            path: activePathRef.current,
            referrer,
            screenResolution,
            language,
            darkMode,
            connectionType,
            utmSource,
            utmMedium,
            utmCampaign,
            scrollPercentage: scrollVal || 0,
            action,
            detail
          })
        });
      } catch (err) {
        // Fail silently in client console
      }
    };

    // Track initial page view mount
    track('Page View');

    // 4. Click tracker event listener
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Filter out trivial clicks
      const clickDetail = target.innerText?.trim().slice(0, 40) || target.tagName;
      track('Click', `Clicked element: ${clickDetail}`);
    };
    window.addEventListener('click', handleClick);

    // 5. Scroll depth tracker event listener
    let maxScroll = 0;
    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const pct = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);
      if (pct > maxScroll) {
        maxScroll = pct;
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Report maximum scroll percentage when user unmounts or beforeunload
    const handleUnload = () => {
      if (maxScroll > 15) {
        track('Scroll', `Scrolled to ${maxScroll}%`, maxScroll);
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleUnload);
      // Run unload tracker final sync on path changes
      handleUnload();
    };
  }, [pathname, searchParams]);

  return null;
}
