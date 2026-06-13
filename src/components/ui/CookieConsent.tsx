'use client'

import { useEffect, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ConsentState = 'accepted' | 'rejected' | null

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const COOKIE_NAME = 'rufus_cookie_consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year in seconds

function getConsent(): ConsentState {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  const val = match.split('=')[1]
  if (val === 'accepted' || val === 'rejected') return val
  return null
}

function setConsent(value: 'accepted' | 'rejected') {
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    // Show banner only if no consent decision has been stored
    if (getConsent() === null) {
      // Small delay so it doesn't flash immediately on first paint
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss(choice: 'accepted' | 'rejected') {
    setConsent(choice)
    setAnimateOut(true)
    setTimeout(() => setVisible(false), 350)

    if (choice === 'accepted') {
      // Fire a custom event so layout.tsx can load analytics/reCAPTCHA
      window.dispatchEvent(new CustomEvent('rufus:consent:accepted'))
    }
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes rfSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes rfSlideDown {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(100%); opacity: 0; }
        }
        .rf-cookie-banner {
          animation: rfSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .rf-cookie-banner.rf-out {
          animation: rfSlideDown 0.35s cubic-bezier(0.4, 0, 1, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .rf-cookie-banner,
          .rf-cookie-banner.rf-out { animation: none; }
        }
      `}</style>

      {/* Backdrop blur on mobile so banner stands out against content */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          background: 'rgba(0,0,0,0.35)',
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
        className={`rf-cookie-banner${animateOut ? ' rf-out' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: '#0d0d0d',
          borderTop: '3px solid #ff8000',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -8px 40px rgba(255,128,0,0.18), 0 -2px 0 #ff8000',
          maxWidth: '100%',
        }}
      >
        {/* Orange accent bar — "the pop" */}
        <div style={{
          position: 'absolute',
          top: -3,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #ff8000 0%, #ffb347 50%, #ff8000 100%)',
          backgroundSize: '200% 100%',
          animation: 'none',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          flexWrap: 'wrap',
        }}>
          {/* Label pill */}
          <span style={{
            display: 'inline-block',
            background: '#ff8000',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '2px',
            flexShrink: 0,
            marginTop: '2px',
          }}>
            Cookies
          </span>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{
              color: '#fff',
              fontSize: '14px',
              lineHeight: 1.55,
              margin: 0,
              fontWeight: 500,
            }}>
              We use cookies to analyse site traffic and improve your experience.
              We never sell your data.{' '}
              <a
                href="/privacy"
                style={{
                  color: '#ff8000',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  fontWeight: 600,
                }}
              >
                Privacy policy →
              </a>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => dismiss('accepted')}
            style={{
              background: '#ff8000',
              color: '#fff',
              border: 'none',
              padding: '11px 24px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e67300')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ff8000')}
          >
            Accept all
          </button>

          <button
            onClick={() => dismiss('rejected')}
            style={{
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              padding: '11px 24px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'border-color 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#555'
              e.currentTarget.style.color = '#aaa'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#333'
              e.currentTarget.style.color = '#888'
            }}
          >
            Reject optional
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Re-open hook (for footer "Cookie preferences" link) ──────────────────────

export function useCookieConsent() {
  function openPreferences() {
    // Clear the stored consent so the banner re-appears on next render
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`
    window.location.reload()
  }
  return { openPreferences }
}
