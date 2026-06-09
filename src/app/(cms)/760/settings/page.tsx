'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'

interface Settings { id: string; site_name: string; phone: string; email: string; address: string; google_rating: number; google_review_count: number; facebook_url: string; instagram_url: string; linkedin_url: string; calendly_url: string }

export default function SettingsPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [s, setS] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => { if (data) setS(data) })
  }, [])

  const save = async () => {
    if (!s) return
    setSaving(true)
    const { error } = await supabase.from('site_settings').update({ ...s, updated_at: new Date().toISOString() }).eq('id', s.id)
    show(error ? 'Error saving' : 'Settings saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  const set = (f: keyof Settings, v: unknown) => setS(x => x ? { ...x, [f]: v } : x)

  if (!s) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>⚙️ Site Settings</h1>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact details</h2>
        <div className="field"><label>Phone</label><input value={s.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
        <div className="field"><label>Email</label><input type="email" value={s.email || ''} onChange={e => set('email', e.target.value)} /></div>
        <div className="field"><label>Address</label><input value={s.address || ''} onChange={e => set('address', e.target.value)} /></div>
        <div className="field"><label>Calendly booking URL</label><input value={s.calendly_url || ''} onChange={e => set('calendly_url', e.target.value)} /></div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social media</h2>
        <div className="field"><label>Facebook URL</label><input value={s.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/..." /></div>
        <div className="field"><label>Instagram URL</label><input value={s.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..." /></div>
        <div className="field"><label>LinkedIn URL</label><input value={s.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/..." /></div>
      </div>

      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Google reviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="field" style={{ margin: 0 }}><label>Rating (e.g. 4.9)</label><input type="number" step="0.1" min="1" max="5" value={s.google_rating || ''} onChange={e => set('google_rating', parseFloat(e.target.value))} /></div>
          <div className="field" style={{ margin: 0 }}><label>Number of reviews</label><input type="number" value={s.google_review_count || ''} onChange={e => set('google_review_count', parseInt(e.target.value))} /></div>
        </div>
      </div>
    </div>
  )
}
