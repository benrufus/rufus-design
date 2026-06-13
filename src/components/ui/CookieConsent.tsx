'use client'

import { useEffect, useState } from 'react'

const COOKIE_NAME = 'rufus_cookie_consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function getConsent(): 'accepted' | 'rejected' | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find(r => r.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  const val = match.split('=')[1]
  return val === 'accepted' || val === 'rejected' ? val : null
}

function setConsent(value: 'accepted' | 'rejected') {
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    if (getConsent() === null) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss(choice: 'accepted' | 'rejected') {
    setConsent(choice)
    setAnimateOut(true)
    setTimeout(() => setVisible(false), 350)
    if (choice === 'accepted') {
      window.dispatchEvent(new CustomEvent('rufus:consent:accepted'))
    }
  }

  if (!visible) return null

  return (
    <>
      <div
        className="cookie-backdrop"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
        className={`cookie-banner${animateOut ? ' cookie-banner--out' : ''}`}
      >
        <div className="cookie-banner__top">
          <span className="cookie-banner__pill">Cookies</span>
          <p className="cookie-banner__text">
            We use cookies to analyse site traffic and improve your experience.
            We never sell your data.{' '}
            <a href="/privacy" className="cookie-banner__link">Privacy policy →</a>
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button
            className="btn-primary cookie-banner__accept"
            onClick={() => dismiss('accepted')}
          >
            Accept all
          </button>
          <button
            className="cookie-banner__reject"
            onClick={() => dismiss('rejected')}
          >
            Reject optional
          </button>
        </div>
      </div>
    </>
  )
}

export function useCookieConsent() {
  function openPreferences() {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`
    window.location.reload()
  }
  return { openPreferences }
}
