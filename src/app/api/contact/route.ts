import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Verify reCAPTCHA v3
    const { recaptchaToken, ...formData } = body
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'Missing verification token' }, { status: 400 })
      }
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success || verifyData.score < 0.5) {
        console.warn('reCAPTCHA failed:', verifyData)
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
      }
    }

    // Save to Supabase
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    await admin.from('contact_submissions').insert({
      data: formData,
      created_at: new Date().toISOString(),
    })

    // Try Brevo
    const apiKey = process.env.BREVO_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'hello@rufusdesign.co.uk'
    if (apiKey) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@rufusdesign.co.uk'
      const fields = Object.entries(formData)
        .filter(([, v]) => v)
        .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
        .join('')
      const replyEmail = formData.email || formData.Email
      const senderName = formData.firstName
        ? `${formData.firstName} ${formData.lastName || ''}`.trim()
        : replyEmail || 'Website visitor'
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: { name: 'Rufus Design Website', email: senderEmail },
            to: [{ email: contactEmail, name: 'Rufus Design' }],
            replyTo: replyEmail ? { email: replyEmail, name: senderName } : undefined,
            subject: `New enquiry from ${senderName}`,
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;padding:20px">${fields}<hr style="margin:20px 0;border:1px solid #eee"/><p style="color:#999;font-size:12px">Sent from rufusdesign.co.uk contact form</p></div>`,
          }),
        })
        if (!res.ok) console.warn('Brevo send failed (submission saved to DB):', await res.text())
      } catch (emailErr) {
        console.warn('Brevo error (submission saved to DB):', emailErr)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
