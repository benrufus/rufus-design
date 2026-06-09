'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface Settings {
  id: string; site_name: string; phone: string; email: string; address: string
  google_rating: number; google_review_count: number; facebook_url: string
  instagram_url: string; linkedin_url: string; calendly_url: string
  favicon_url?: string; og_image_url?: string
}

export default function SettingsPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [s, setS] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const faviconRef = useRef<HTMLInputElement>(null)
  const ogRef = useRef<HTMLInputElement>(null)

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

  const uploadFile = async (file: File, field: 'favicon_url' | 'og_image_url') => {
    setUploading(field)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'branding')
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (json.url) {
        set(field, json.url)
        show('Uploaded! Click Save to apply.', 'success')
      } else {
        show(json.error || 'Upload failed', 'error')
      }
    } catch {
      show('Upload failed', 'error')
    }
    setUploading(null)
  }

  if (!s) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>⚙️ Site Settings</h1>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      {/* Branding */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branding</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Favicon */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem' }}>Favicon</p>
            <div
              onClick={() => faviconRef.current?.click()}
              style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', borderRadius: '6px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,128,0,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              {s.favicon_url ? (
                <img src={s.favicon_url} alt="Favicon" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 0.5rem', display: 'block' }} />
              ) : (
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {uploading === 'favicon_url' ? 'Uploading...' : 'Click to upload'}
              </p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.25rem' }}>ICO or PNG, 32×32px</p>
            </div>
            <input ref={faviconRef} type="file" accept=".ico,.png,.svg" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'favicon_url')} />
          </div>

          {/* OG Image */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem' }}>Default Social Share Image</p>
            <div
              onClick={() => ogRef.current?.click()}
              style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', borderRadius: '6px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,128,0,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              {s.og_image_url ? (
                <img src={s.og_image_url} alt="OG Image" style={{ width: '100%', maxHeight: '80px', objectFit: 'cover', margin: '0 auto 0.5rem', display: 'block' }} />
              ) : (
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {uploading === 'og_image_url' ? 'Uploading...' : 'Click to upload'}
              </p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.25rem' }}>1200×630px recommended</p>
            </div>
            <input ref={ogRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'og_image_url')} />
          </div>
        </div>

        {s.favicon_url && (
          <div className="field" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <label>Favicon URL</label>
            <input value={s.favicon_url || ''} onChange={e => set('favicon_url', e.target.value)} placeholder="https://..." />
          </div>
        )}

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,128,0,0.05)', border: '1px solid rgba(255,128,0,0.15)', borderRadius: '6px' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            ⚠️ After uploading a new favicon, copy the URL and place the file at <code style={{ color: 'rgba(255,128,0,0.8)' }}>src/app/icon.png</code> in your repo for Next.js to serve it. The URL here is used for SEO metadata.
          </p>
        </div>
      </div>

      {/* Contact details */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact details</h2>
        <div className="field"><label>Phone</label><input value={s.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
        <div className="field"><label>Email</label><input type="email" value={s.email || ''} onChange={e => set('email', e.target.value)} /></div>
        <div className="field"><label>Address</label><input value={s.address || ''} onChange={e => set('address', e.target.value)} /></div>
        <div className="field"><label>Calendly booking URL</label><input value={s.calendly_url || ''} onChange={e => set('calendly_url', e.target.value)} /></div>
      </div>

      {/* Social */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social media</h2>
        <div className="field"><label>Facebook URL</label><input value={s.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/..." /></div>
        <div className="field"><label>Instagram URL</label><input value={s.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..." /></div>
        <div className="field"><label>LinkedIn URL</label><input value={s.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/..." /></div>
      </div>

      {/* Google reviews */}
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
