'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsSettingsPage() {
  const [data, setData] = useState<any>({ phone: '', email: '', address: '', facebook: '', instagram: '', linkedin: '', twitter: '', google_rating: '', google_review_count: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('site_settings').select('*').single()
      .then(({ data }) => { if (data) setData(data); setLoading(false) })
  }, [])

  function upd(k: string, v: string) { setData((d: any) => ({ ...d, [k]: v })) }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({ id: data.id || 1, ...data })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header"><h1>Site Settings<span style={{ color: 'var(--orange)' }}>.</span></h1></div>

      <div className="cms-card">
        <h2>Contact details</h2>
        <div className="cms-field"><label>Phone</label><input value={data.phone || ''} onChange={e => upd('phone', e.target.value)} placeholder="01442 123 456" /></div>
        <div className="cms-field"><label>Email</label><input value={data.email || ''} onChange={e => upd('email', e.target.value)} placeholder="hello@rufusdesign.co.uk" /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>Address</label><textarea value={data.address || ''} onChange={e => upd('address', e.target.value)} rows={2} placeholder="Berkhamsted, Hertfordshire" /></div>
      </div>

      <div className="cms-card">
        <h2>Social media</h2>
        <div className="cms-field"><label>Facebook URL</label><input value={data.facebook || ''} onChange={e => upd('facebook', e.target.value)} /></div>
        <div className="cms-field"><label>Instagram URL</label><input value={data.instagram || ''} onChange={e => upd('instagram', e.target.value)} /></div>
        <div className="cms-field"><label>LinkedIn URL</label><input value={data.linkedin || ''} onChange={e => upd('linkedin', e.target.value)} /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>Twitter / X URL</label><input value={data.twitter || ''} onChange={e => upd('twitter', e.target.value)} /></div>
      </div>

      <div className="cms-card">
        <h2>Google reviews</h2>
        <div className="cms-field"><label>Rating (e.g. 4.9)</label><input value={data.google_rating || ''} onChange={e => upd('google_rating', e.target.value)} placeholder="4.9" /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>Review count</label><input value={data.google_review_count || ''} onChange={e => upd('google_review_count', e.target.value)} placeholder="47" /></div>
      </div>

      <button className="cms-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
    </>
  )
}
