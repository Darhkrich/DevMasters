'use client';

import Script from 'next/script';
import { logAppInfo } from '@/lib/logging';

export default function TiltScriptLoader() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.2/dist/vanilla-tilt.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        logAppInfo('Vanilla Tilt loaded successfully');
        // Initialize tilt effect here if needed
      }}
    />
  );
}
