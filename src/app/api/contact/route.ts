import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message, ...rest } = body

    const apiKey = process.env.BREVO_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'hello@rufusdesign.co.uk'

    if (!apiKey) return NextResponse.json({ error: 'Email not configured' }, { status: 500 })

    const fields = Object.entries({ name, email, message, ...rest })
      .filter(([, v]) => v)
      .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
      .join('')

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Rufus Design Website', email: 'noreply@rufusdesign.co.uk' },
        to: [{ email: contactEmail, name: 'Rufus Design' }],
        replyTo: email ? { email, name: name || email } : undefined,
        subject: `New enquiry from ${name || email || 'website'}`,
        htmlContent: `<div style="font-family:sans-serif;max-width:600px">${fields}</div>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Brevo error:', err)
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
