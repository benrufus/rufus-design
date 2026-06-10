'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'
import RichTextEditor from '@/components/ui/RichTextEditor'

const ALL_TAGS = ['Web Design', 'Web Development', 'SEO', 'PPC', 'Managed Hosting', 'Branding', 'Data Analytics', 'Social Media']

interface GalleryImage { url: string; alt: string }
interface Result { metric: string; value: string }

interface WorkItem {
  id?: string; title: string; slug: string; client: string; year: number | ''; url: string
  tags: string[]; excerpt: string; cover_image: string; cover_image_alt: string; body: string
  gallery: GalleryImage[]; results: Result[]
  featured: boolean; published: boolean; sort_order: number
}

const empty: WorkItem = {
  title: '', slug: '', client: '', year: '', url: '', tags: [], excerpt: '',
  cover_image: '', cover_image_alt: '', body: '', gallery: [], results: [],
  featured: false, published: true, sort_order: 0
}

export default function WorkEditor() {
  const supabase = createClient()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { show } = useToast()
  const [item, setItem] = useState<WorkItem>(empty)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'details' | 'content' | 'gallery' | 'results'>('details')
  const galleryUploadRef = useRef<HTMLInputElement>(null)
  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew) {
      supabase.from('work').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setItem({
          ...data,
          gallery: data.gallery || [],
          results: data.results || [],
          cover_image_alt: data.cover_image_alt || '',
        })
      })
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

  const addGalleryImage = (url: string) => {
    set('gallery', [...item.gallery, { url, alt: '' }])
  }

  const updateGalleryAlt = (i: number, alt: string) => {
    const updated = item.gallery.map((img, idx) => idx === i ? { ...img, alt } : img)
    set('gallery', updated)
  }

  const removeGalleryImage = (i: number) => {
    set('gallery', item.gallery.filter((_, idx) => idx !== i))
  }

  const addResult = () => set('results', [...item.results, { metric: '', value: '' }])

  const updateResult = (i: number, field: 'metric' | 'value', val: string) => {
    const updated = item.results.map((r, idx) => idx === i ? { ...r, [field]: val } : r)
    set('results', updated)
  }

  const removeResult = (i: number) => set('results', item.results.filter((_, idx) => idx !== i))

  const TAB = (t: typeof tab) => ({
    padding: '0.5rem 1rem',
    background: tab === t ? 'rgba(255,128,0,0.15)' : 'transparent',
    border: tab === t ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
    color: tab === t ? '#ff8000' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer', borderRadius: '6px', fontSize: '0.825rem',
    fontWeight: tab === t ? 600 : 400,
  })

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
            Featured
          </label>
          <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button style={TAB('details')} onClick={() => setTab('details')}>📋 Details</button>
        <button style={TAB('content')} onClick={() => setTab('content')}>📝 Content</button>
        <button style={TAB('gallery')} onClick={() => setTab('gallery')}>🖼 Gallery {item.gallery.length > 0 && `(${item.gallery.length})`}</button>
        <button style={TAB('results')} onClick={() => setTab('results')}>📊 Results {item.results.length > 0 && `(${item.results.length})`}</button>
      </div>

      {/* DETAILS TAB */}
      {tab === 'details' && (
        <>
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
            <label>Cover image alt text</label>
            <input value={item.cover_image_alt || ''} onChange={e => set('cover_image_alt', e.target.value)} placeholder="Describe the cover image for accessibility and SEO" />
          </div>
        </>
      )}

      {/* CONTENT TAB */}
      {tab === 'content' && (
        <div className="field">
          <label>Case study body</label>
          <RichTextEditor value={item.body || ''} onChange={html => set('body', html)} placeholder="Write the full case study here..." />
        </div>
      )}

      {/* GALLERY TAB */}
      {tab === 'gallery' && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Add project screenshots and images. Each image needs an alt text for SEO and accessibility.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {item.gallery.map((img, i) => (
              <div key={i} className="card-sm" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <img src={img.url} alt={img.alt} style={{ width: '120px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
                <div className="field" style={{ margin: 0 }}>
                  <label>Alt text</label>
                  <input value={img.alt} onChange={e => updateGalleryAlt(i, e.target.value)} placeholder="Describe this image..." />
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeGalleryImage(i)}>✕</button>
              </div>
            ))}
          </div>
          <ImageUpload
            value=""
            onChange={url => { if (url) addGalleryImage(url) }}
            folder="work"
            label="Upload gallery image"
          />
        </div>
      )}

      {/* RESULTS TAB */}
      {tab === 'results' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              Key metrics shown as stats on the project page.
            </p>
            <button className="btn btn-ghost btn-sm" onClick={addResult}>+ Add result</button>
          </div>
          {item.results.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No results yet. Click "+ Add result" to add one.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {item.results.map((r, i) => (
              <div key={i} className="card-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Value</label>
                  <input value={r.value} onChange={e => updateResult(i, 'value', e.target.value)} placeholder="e.g. 300%" />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Metric</label>
                  <input value={r.metric} onChange={e => updateResult(i, 'metric', e.target.value)} placeholder="e.g. Increase in enquiries" />
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeResult(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
