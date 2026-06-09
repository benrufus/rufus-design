import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Save to Supabase first (reliable, no IP issues)
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    await admin.from('contact_submissions').insert({
      data: body,
      created_at: new Date().toISOString(),
    })

    // Try Brevo — but don't fail if it errors
    const apiKey = process.env.BREVO_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'hello@rufusdesign.co.uk'

    if (apiKey) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@rufusdesign.co.uk'
      const fromName = 'Rufus Design Website'

      const fields = Object.entries(body)
        .filter(([, v]) => v)
        .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
        .join('')

      const replyEmail = body.email || body.Email
      const senderName = body.name || body.Name || replyEmail || 'Website visitor'

      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: { name: fromName, email: senderEmail },
            to: [{ email: contactEmail, name: 'Rufus Design' }],
            replyTo: replyEmail ? { email: replyEmail, name: senderName } : undefined,
            subject: `New enquiry from ${senderName}`,
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;padding:20px">${fields}<hr style="margin:20px 0;border:1px solid #eee"/><p style="color:#999;font-size:12px">Sent from rufusdesign.co.uk contact form</p></div>`,
          }),
        })
        if (!res.ok) {
          const err = await res.text()
          console.warn('Brevo send failed (submission saved to DB):', err)
        }
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
