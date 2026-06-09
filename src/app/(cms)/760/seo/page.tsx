'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsSeoPage() {
  const [data, setData] = useState<any>({ ga4_id: '', gtm_id: '', google_verify: '', bing_verify: '', custom_head_scripts: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('seo_settings').select('*').single()
      .then(({ data }) => { if (data) setData(data); setLoading(false) })
  }, [])

  function upd(k: string, v: string) { setData((d: any) => ({ ...d, [k]: v })) }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('seo_settings').upsert({ id: data.id || 1, ...data })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header"><h1>SEO & Analytics<span style={{ color: 'var(--orange)' }}>.</span></h1></div>

      <div className="cms-card">
        <h2>Analytics</h2>
        <div className="cms-field"><label>Google Analytics 4 ID</label><input value={data.ga4_id || ''} onChange={e => upd('ga4_id', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>Google Tag Manager ID</label><input value={data.gtm_id || ''} onChange={e => upd('gtm_id', e.target.value)} placeholder="GTM-XXXXXXX" /></div>
      </div>

      <div className="cms-card">
        <h2>Verification codes</h2>
        <div className="cms-field"><label>Google Search Console verification</label><input value={data.google_verify || ''} onChange={e => upd('google_verify', e.target.value)} placeholder="Paste meta content value" /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>Bing Webmaster verification</label><input value={data.bing_verify || ''} onChange={e => upd('bing_verify', e.target.value)} /></div>
      </div>

      <div className="cms-card">
        <h2>Custom &lt;head&gt; scripts</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>Injected into &lt;head&gt; on every page. Use with care.</p>
        <div className="cms-field" style={{ marginBottom: 0 }}>
          <textarea value={data.custom_head_scripts || ''} onChange={e => upd('custom_head_scripts', e.target.value)} rows={6} style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} placeholder="<!-- e.g. Hotjar, Intercom, custom scripts -->" />
        </div>
      </div>

      <button className="cms-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
    </>
  )
}
