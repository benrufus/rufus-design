'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'

interface Props { params: Promise<{ id: string }> }

export default function CmsNewsEditor({ params }: Props) {
  const [id, setId] = useState('')
  const [data, setData] = useState<any>({ title: '', slug: '', excerpt: '', body: '', cover_image: '', published: false, published_at: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'content' | 'seo'>('content')
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      supabase.from('posts').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setData(data); setLoading(false) })
    })
  }, [])

  function upd(k: string, v: any) { setData((d: any) => ({ ...d, [k]: v })) }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('posts').update(data).eq('id', id)
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>{data.title || 'Edit post'}<span style={{ color: 'var(--orange)' }}>.</span></h1>
          <p>/{data.slug}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => router.push('/760/news')} className="cms-btn-secondary">← Back</button>
          <button onClick={save} className="cms-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="cms-tabs">
            <button className={`cms-tab${tab === 'content' ? ' active' : ''}`} onClick={() => setTab('content')}>Content</button>
            <button className={`cms-tab${tab === 'seo' ? ' active' : ''}`} onClick={() => setTab('seo')}>SEO</button>
          </div>

          {tab === 'content' ? (
            <div className="cms-card">
              <div className="cms-field"><label>Title</label><input value={data.title || ''} onChange={e => upd('title', e.target.value)} /></div>
              <div className="cms-field"><label>Slug</label><input value={data.slug || ''} onChange={e => upd('slug', e.target.value)} /></div>
              <div className="cms-field"><label>Excerpt</label><textarea value={data.excerpt || ''} onChange={e => upd('excerpt', e.target.value)} rows={3} /></div>
              <div className="cms-field" style={{ marginBottom: 0 }}>
                <label>Body (HTML)</label>
                <textarea value={data.body || ''} onChange={e => upd('body', e.target.value)} rows={14} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} placeholder="<p>…</p>" />
              </div>
            </div>
          ) : (
            <div className="cms-card">
              <div className="cms-field"><label>Meta title</label><input value={data.meta_title || ''} onChange={e => upd('meta_title', e.target.value)} placeholder={data.title} /></div>
              <div className="cms-field" style={{ marginBottom: 0 }}><label>Meta description</label><textarea value={data.meta_description || ''} onChange={e => upd('meta_description', e.target.value)} rows={3} /></div>
            </div>
          )}
        </div>

        <div>
          <div className="cms-card">
            <h2>Status</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input type="checkbox" checked={!!data.published} onChange={e => upd('published', e.target.checked)} />
              <span style={{ color: '#fff', fontSize: '0.875rem' }}>Published</span>
            </label>
            <div className="cms-field" style={{ marginBottom: 0 }}>
              <label>Publish date</label>
              <input type="date" value={data.published_at ? data.published_at.slice(0, 10) : ''} onChange={e => upd('published_at', e.target.value)} />
            </div>
          </div>
          <div className="cms-card">
            <ImageUpload value={data.cover_image} onChange={url => upd('cover_image', url)} label="Cover image" />
          </div>
        </div>
      </div>
    </>
  )
}
