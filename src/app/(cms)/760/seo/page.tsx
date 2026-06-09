'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'

interface SeoSettings { id: string; google_verification: string; ga4_id: string; gtm_id: string; head_scripts: string; body_scripts: string }

export default function SeoPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [s, setS] = useState<SeoSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('seo_settings').select('*').single().then(({ data }) => { if (data) setS(data) })
  }, [])

  const save = async () => {
    if (!s) return
    setSaving(true)
    const { error } = await supabase.from('seo_settings').update({ ...s, updated_at: new Date().toISOString() }).eq('id', s.id)
    show(error ? 'Error saving' : 'SEO settings saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  const set = (f: keyof SeoSettings, v: string) => setS(x => x ? { ...x, [f]: v } : x)

  if (!s) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>🔍 SEO & Analytics</h1>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Google</h2>
        <div className="field">
          <label>Search Console verification code</label>
          <input value={s.google_verification || ''} onChange={e => set('google_verification', e.target.value)} placeholder="Paste the content= value from the meta tag" />
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Google Search Console → Verify → HTML tag → copy the content= value only</p>
        </div>
        <div className="field">
          <label>Google Analytics 4 ID</label>
          <input value={s.ga4_id || ''} onChange={e => set('ga4_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Google Tag Manager ID</label>
          <input value={s.gtm_id || ''} onChange={e => set('gtm_id', e.target.value)} placeholder="GTM-XXXXXXX" />
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>If using GTM, leave GA4 blank — manage GA4 through GTM instead</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom scripts</h2>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>For Hotjar, cookie banners, live chat etc.</p>
        <div className="field">
          <label>Head scripts (before &lt;/head&gt;)</label>
          <textarea value={s.head_scripts || ''} onChange={e => set('head_scripts', e.target.value)} rows={4} placeholder='<script src="...">' style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Body scripts (before &lt;/body&gt;)</label>
          <textarea value={s.body_scripts || ''} onChange={e => set('body_scripts', e.target.value)} rows={4} placeholder='<noscript>...' style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
        </div>
      </div>
    </div>
  )
}
