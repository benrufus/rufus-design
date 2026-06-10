'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'

export default function ServiceEditor() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const { show } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', intro: '', body: '',
    hero_image: '', meta_title: '', meta_description: '',
    sort_order: 0, featured: false, published: false,
  })

  useEffect(() => {
    supabase.from('services_pages').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setForm(data); setLoading(false) })
  }, [id])

  const set = (f: string, v: any) => setForm(x => ({ ...x, [f]: v }))

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('services_pages')
      .update({ ...form, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) show(error.message, 'error')
    else show('Saved!', 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '2.5rem', color: 'var(--muted)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => router.push('/760/services')}
            style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '0.5rem' }}>
            ← All services
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{form.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <label className="toggle">
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
              <span className="toggle-slider" />
            </label>
            Published
          </label>
          <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page details</h2>
        <div className="field"><label>Title</label><input value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="field">
          <label>Slug</label>
          <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} />
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem' }}>URL: /services/{form.slug}</p>
        </div>
        <div className="field"><label>Excerpt (used in listings)</label><textarea value={form.excerpt || ''} onChange={e => set('excerpt', e.target.value)} rows={2} /></div>
        <div className="field"><label>Intro (shown in hero)</label><textarea value={form.intro || ''} onChange={e => set('intro', e.target.value)} rows={3} /></div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hero image</h2>
        <ImageUpload value={form.hero_image || ''} onChange={url => set('hero_image', url)} folder="services" label="Hero image" />
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page content</h2>
        <div className="field">
          <label>Body content (HTML)</label>
          <textarea value={form.body || ''} onChange={e => set('body', e.target.value)} rows={12} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO</h2>
        <div className="field">
          <label>Meta title</label>
          <input value={form.meta_title || ''} onChange={e => set('meta_title', e.target.value)} placeholder={`${form.title} | Rufus Design`} />
        </div>
        <div className="field">
          <label>Meta description</label>
          <textarea value={form.meta_description || ''} onChange={e => set('meta_description', e.target.value)} rows={3} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <div className="field" style={{ margin: 0, flex: 1 }}>
            <label>Sort order</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            Featured
          </label>
        </div>
      </div>
    </div>
  )
}
