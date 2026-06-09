'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'
import RichTextEditor from '@/components/ui/RichTextEditor'

const ALL_TAGS = ['Web Design', 'Web Development', 'SEO', 'PPC', 'Managed Hosting', 'Branding', 'Data Analytics', 'Social Media']

interface WorkItem {
  id?: string; title: string; slug: string; client: string; year: number | ''; url: string
  tags: string[]; excerpt: string; cover_image: string; body: string
  featured: boolean; published: boolean; sort_order: number
}

const empty: WorkItem = { title: '', slug: '', client: '', year: '', url: '', tags: [], excerpt: '', cover_image: '', body: '', featured: false, published: true, sort_order: 0 }

export default function WorkEditor() {
  const supabase = createClient()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { show } = useToast()
  const [item, setItem] = useState<WorkItem>(empty)
  const [saving, setSaving] = useState(false)
  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew) {
      supabase.from('work').select('*').eq('id', id).single().then(({ data }) => { if (data) setItem(data) })
    }
  }, [id])

  const set = (field: keyof WorkItem, value: unknown) => setItem(x => ({ ...x, [field]: value }))

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const save = async () => {
    setSaving(true)
    const data = { ...item, slug: item.slug || slugify(item.title), updated_at: new Date().toISOString() }
    if (isNew) {
      const { data: created, error } = await supabase.from('work').insert(data).select().single()
      if (error) { show('Error: ' + error.message, 'error'); setSaving(false); return }
      show('Project created!', 'success')
      router.push(`/760/work/${created.id}`)
    } else {
      const { error } = await supabase.from('work').update(data).eq('id', id)
      show(error ? 'Error saving' : 'Saved!', error ? 'error' : 'success')
    }
    setSaving(false)
  }

  const toggleTag = (tag: string) => set('tags', item.tags.includes(tag) ? item.tags.filter(t => t !== tag) : [...item.tags, tag])

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => router.push('/760/work')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '0.5rem', padding: 0 }}>← Back to projects</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{isNew ? '+ New Project' : 'Edit Project'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <label className="toggle"><input type="checkbox" checked={item.published} onChange={e => set('published', e.target.checked)} /><span className="toggle-slider" /></label>
            Published
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <label className="toggle"><input type="checkbox" checked={item.featured} onChange={e => set('featured', e.target.checked)} /><span className="toggle-slider" /></label>
            Featured (homepage)
          </label>
          <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="field">
          <label>Project title *</label>
          <input value={item.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)) }} />
        </div>
        <div className="field">
          <label>URL slug</label>
          <input value={item.slug} onChange={e => set('slug', e.target.value)} />
        </div>
        <div className="field">
          <label>Client name</label>
          <input value={item.client || ''} onChange={e => set('client', e.target.value)} />
        </div>
        <div className="field">
          <label>Year</label>
          <input type="number" value={item.year || ''} onChange={e => set('year', e.target.value ? parseInt(e.target.value) : '')} />
        </div>
      </div>

      <div className="field">
        <label>Live URL</label>
        <input value={item.url || ''} onChange={e => set('url', e.target.value)} placeholder="https://example.co.uk" />
      </div>

      <div className="field">
        <label>Services / Tags</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {ALL_TAGS.map(tag => (
            <button type="button" key={tag} onClick={() => toggleTag(tag)}
              style={{ padding: '0.35em 0.85em', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: item.tags.includes(tag) ? 'rgba(255,128,0,0.2)' : 'rgba(255,255,255,0.05)', border: item.tags.includes(tag) ? '1px solid rgba(255,128,0,0.5)' : '1px solid rgba(255,255,255,0.1)', color: item.tags.includes(tag) ? '#ff8000' : 'rgba(255,255,255,0.5)' }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Short description (shown in listings)</label>
        <textarea value={item.excerpt || ''} onChange={e => set('excerpt', e.target.value)} rows={2} />
      </div>

      <ImageUpload value={item.cover_image || ''} onChange={url => set('cover_image', url)} folder="work" label="Cover image (1400×700px recommended)" />

      <div className="field">
        <label>Case study body</label>
        <RichTextEditor value={item.body || ''} onChange={html => set('body', html)} placeholder="Write the full case study here..." />
      </div>
    </div>
  )
}
