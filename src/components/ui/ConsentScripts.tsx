'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/**
 * ConsentScripts
 *
 * Renders Matomo + reCAPTCHA only after the user accepts cookies.
 * Place this inside your root layout <body>, after <CookieConsent />.
 *
 * It also listens for the real-time consent event so scripts load
 * immediately when the user clicks "Accept" — without a page reload.
 */
export default function ConsentScripts() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    // Check cookie on mount
    const existing = document.cookie
      .split('; ')
      .find(r => r.startsWith('rufus_cookie_consent='))
    if (existing?.includes('accepted')) {
      setConsented(true)
      return
    }

    // Also listen for real-time acceptance (user clicks Accept on banner)
    function handleConsent() { setConsented(true) }
    window.addEventListener('rufus:consent:accepted', handleConsent)
    return () => window.removeEventListener('rufus:consent:accepted', handleConsent)
  }, [])

  if (!consented) return null

  return (
    <>
      {/* ── Matomo ─────────────────────────────────────────────────── */}
      <Script
        id="matomo-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://analytics.rufusdesign.co.uk/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '1']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `,
        }}
      />

      {/* ── Google reCAPTCHA v3 ────────────────────────────────────── */}
      <Script
        id="recaptcha"
        src="https://www.google.com/recaptcha/api.js?render=6LcNj-UfAAAAAOFhNlNgtdstSueqbO_oBWuJ-D3L"
        strategy="afterInteractive"
      />
    </>
  )
}
