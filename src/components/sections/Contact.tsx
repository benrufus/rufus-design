'use client'
import { useState, useEffect } from 'react'
import { useReveal } from '@/lib/useReveal'

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (key: string, options: { action: string }) => Promise<string>
    }
  }
}

interface ContactProps {
  phone?: string
  email?: string
  fields?: any[]
}

export default function Contact({ phone, email }: ContactProps) {
  const { ref, visible } = useReveal()
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const displayEmail = email || 'hello@rufusdesign.co.uk'
  const displayPhone = phone || '01442 967775'

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) return
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      let recaptchaToken = ''
      if (siteKey && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute(siteKey, { action: 'contact' }).then(resolve).catch(reject)
          })
        })
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLElement>} className={`contact-section${visible ? ' visible' : ''}`}>
      <div className="contact-info">
        <p className="section-eyebrow">Get in touch</p>
        <h2 className="contact-heading">Let&apos;s<br /><span className="text-orange">talk.</span></h2>
        <p className="contact-subtext">
          To arrange a meeting, discuss your business goals or even just have a quick cuppa.
        </p>
        <div className="contact-links">
          {[
            ['mailto:' + displayEmail, displayEmail],
            ['tel:' + displayPhone.replace(/\s/g, ''), displayPhone],
            ['https://calendly.com/ben-rufusdesign/30min', 'Book a meeting online'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="contact-link">
              <span className="contact-link-arrow">→</span>{label}
            </a>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        {status === 'sent' ? (
          <div className="contact-success">
            ✓ Message sent — we&apos;ll be in touch shortly.
          </div>
        ) : (
          <>
            <div className="contact-name-row">
  <div className="contact-field">
    <label htmlFor="firstName" className="contact-label">First name</label>
    <input id="firstName" name="firstName" type="text" className="contact-input" placeholder="Jane"
      value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
  </div>
  <div className="contact-field">
    <label htmlFor="lastName" className="contact-label">Last name</label>
    <input id="lastName" name="lastName" type="text" className="contact-input" placeholder="Smith"
      value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
  </div>
</div>
<div className="contact-field">
  <label htmlFor="company" className="contact-label">Company</label>
  <input id="company" name="company" type="text" className="contact-input" placeholder="Smith & Co Ltd"
    value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
</div>
<div className="contact-field">
  <label htmlFor="email" className="contact-label">Email address *</label>
  <input id="email" name="email" type="email" className="contact-input" placeholder="jane@smithco.com" required
    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
</div>
<div className="contact-field">
  <label htmlFor="message" className="contact-label">Message</label>
  <textarea id="message" name="message" className="contact-input contact-textarea" placeholder="Tell us about your project..." required rows={5}
    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
</div>
            {status === 'error' && <p className="contact-error">Something went wrong — please email us directly.</p>}
            <button type="submit" disabled={status === 'sending'} className="btn-primary contact-submit">
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </>
        )}
      </form>
    </section>
  )
}
