'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Wraps public layout content with pathname key for clean remount on route change.
 * Also logs CSS state for services/pricing routes to debug layout issues.
 */
export default function PublicLayoutContent({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only log for the problematic routes
    if (
      !pathname.startsWith('/services') &&
      pathname !== '/pricing'
    ) {
      return;
    }

    const bodyStyle = window.getComputedStyle(document.body);
    const bodyOpacity = bodyStyle.opacity;

    const servicesEl = document.querySelector('.wc-services-page');
    const servicesOpacity = servicesEl
      ? window.getComputedStyle(servicesEl).opacity
      : null;

    // Console-based instrumentation so you can see values directly
    // #region agent log console
    console.log('[DEBUG H1] services/pricing CSS state', {
      pathname,
      bodyOpacity,
      servicesOpacity,
      hasServicesPage: !!servicesEl,
    });
    // #endregion agent log console

    // #region agent log
    fetch('http://127.0.0.1:7654/ingest/d12143fe-693e-4703-9454-994924290ead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '3fb90f',
      },
      body: JSON.stringify({
        sessionId: '3fb90f',
        runId: 'initial',
        hypothesisId: 'H1',
        location: 'components/common/PublicLayoutContent.jsx:24',
        message: 'services/pricing route CSS state',
        data: {
          pathname,
          bodyOpacity,
          servicesOpacity,
          hasServicesPage: !!servicesEl,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  }, [pathname]);

  return <main key={pathname}>{children}</main>;
}
