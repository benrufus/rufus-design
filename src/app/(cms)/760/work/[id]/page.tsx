'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'

interface Props { params: Promise<{ id: string }> }

export default function CmsWorkEditor({ params }: Props) {
  const [id, setId] = useState('')
  const [data, setData] = useState<any>({ title: '', slug: '', client: '', excerpt: '', body: '', cover_image: '', tags: [], published: false, featured: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      supabase.from('work').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setData(data); setLoading(false) })
    })
  }, [])

  function upd(k: string, v: any) { setData((d: any) => ({ ...d, [k]: v })) }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('work').update(data).eq('id', id)
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  function addTag() {
    if (!tagInput.trim()) return
    upd('tags', [...(data.tags || []), tagInput.trim()])
    setTagInput('')
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>{data.title || 'Edit project'}<span style={{ color: 'var(--orange)' }}>.</span></h1>
          <p>/{data.slug}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => router.push('/760/work')} className="cms-btn-secondary">← Back</button>
          <button onClick={save} className="cms-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="cms-card">
            <h2>Details</h2>
            <div className="cms-field"><label>Title</label><input value={data.title || ''} onChange={e => upd('title', e.target.value)} /></div>
            <div className="cms-field"><label>Slug</label><input value={data.slug || ''} onChange={e => upd('slug', e.target.value)} /></div>
            <div className="cms-field"><label>Client name</label><input value={data.client || ''} onChange={e => upd('client', e.target.value)} /></div>
            <div className="cms-field"><label>Website URL</label><input value={data.website_url || ''} onChange={e => upd('website_url', e.target.value)} /></div>
            <div className="cms-field" style={{ marginBottom: 0 }}><label>Excerpt / intro</label><textarea value={data.excerpt || ''} onChange={e => upd('excerpt', e.target.value)} rows={3} /></div>
          </div>
          <div className="cms-card">
            <h2>Body content (HTML)</h2>
            <div className="cms-field" style={{ marginBottom: 0 }}>
              <textarea value={data.body || ''} onChange={e => upd('body', e.target.value)} rows={12} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} placeholder="<h2>The brief</h2><p>…</p>" />
            </div>
          </div>
        </div>

        <div>
          <div className="cms-card">
            <h2>Status</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              <input type="checkbox" checked={!!data.published} onChange={e => upd('published', e.target.checked)} />
              <span style={{ color: '#fff', fontSize: '0.875rem' }}>Published</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!data.featured} onChange={e => upd('featured', e.target.checked)} />
              <span style={{ color: '#fff', fontSize: '0.875rem' }}>Featured on homepage</span>
            </label>
          </div>

          <div className="cms-card">
            <ImageUpload value={data.cover_image} onChange={url => upd('cover_image', url)} label="Cover image" />
          </div>

          <div className="cms-card">
            <h2>Tags</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {(data.tags || []).map((t: string, i: number) => (
                <span key={i} style={{ background: 'rgba(255,128,0,0.12)', color: 'var(--orange)', padding: '0.2em 0.6em', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {t}<button onClick={() => upd('tags', data.tags.filter((_: any, idx: number) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--orange)', lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag…" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', fontFamily: 'var(--font-body)' }} />
              <button className="cms-btn" onClick={addTag} style={{ padding: '0.5rem 1rem' }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
