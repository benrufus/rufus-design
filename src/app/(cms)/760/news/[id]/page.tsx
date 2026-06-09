'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'
import RichTextEditor from '@/components/ui/RichTextEditor'

const CATEGORIES = ['Web Design', 'SEO', 'PPC', 'Digital Marketing', 'Hosting', 'News', 'Case Study']

interface Post { title: string; slug: string; excerpt: string; cover_image: string; category: string; body: string; author: string; published_at: string; published: boolean; meta_title: string; meta_description: string }
const empty: Post = { title: '', slug: '', excerpt: '', cover_image: '', category: '', body: '', author: 'Rufus Design', published_at: new Date().toISOString(), published: false, meta_title: '', meta_description: '' }

export default function NewsEditor() {
  const supabase = createClient()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { show } = useToast()
  const [post, setPost] = useState<Post>(empty)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'content' | 'seo'>('content')
  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew) supabase.from('posts').select('*').eq('id', id).single().then(({ data }) => { if (data) setPost(data) })
  }, [id])

  const set = (f: keyof Post, v: unknown) => setPost(p => ({ ...p, [f]: v }))
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const save = async () => {
    setSaving(true)
    const data = { ...post, slug: post.slug || slugify(post.title), updated_at: new Date().toISOString() }
    if (isNew) {
      const { data: created, error } = await supabase.from('posts').insert(data).select().single()
      if (error) { show('Error: ' + error.message, 'error'); setSaving(false); return }
      show('Post created!', 'success')
      router.push(`/760/news/${created.id}`)
    } else {
      const { error } = await supabase.from('posts').update(data).eq('id', id)
      show(error ? 'Error saving' : 'Saved!', error ? 'error' : 'success')
    }
    setSaving(false)
  }

  const TAB = (t: typeof tab) => ({ padding: '0.5rem 1rem', background: tab === t ? 'rgba(255,128,0,0.15)' : 'transparent', border: tab === t ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.08)', color: tab === t ? '#ff8000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '6px', fontSize: '0.825rem', fontWeight: tab === t ? 600 : 400 })

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => router.push('/760/news')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '0.5rem', padding: 0 }}>← Back to posts</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{isNew ? '+ New Post' : 'Edit Post'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <label className="toggle"><input type="checkbox" checked={post.published} onChange={e => set('published', e.target.checked)} /><span className="toggle-slider" /></label>
            Published
          </label>
          <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button style={TAB('content')} onClick={() => setTab('content')}>✍️ Content</button>
        <button style={TAB('seo')} onClick={() => setTab('seo')}>🔍 SEO</button>
      </div>

      {tab === 'content' && (
        <>
          <div className="field"><label>Title *</label><input value={post.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)) }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="field"><label>Slug</label><input value={post.slug} onChange={e => set('slug', e.target.value)} /></div>
            <div className="field">
              <label>Category</label>
              <select value={post.category} onChange={e => set('category', e.target.value)}>
                <option value="">No category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Author</label><input value={post.author} onChange={e => set('author', e.target.value)} /></div>
          </div>
          <div className="field"><label>Published date</label><input type="datetime-local" value={post.published_at?.slice(0, 16)} onChange={e => set('published_at', new Date(e.target.value).toISOString())} /></div>
          <div className="field"><label>Excerpt (shown in listings)</label><textarea value={post.excerpt || ''} onChange={e => set('excerpt', e.target.value)} rows={2} /></div>
          <ImageUpload value={post.cover_image || ''} onChange={url => set('cover_image', url)} folder="news" label="Cover image" />
          <div className="field"><label>Article body</label><RichTextEditor value={post.body || ''} onChange={html => set('body', html)} placeholder="Write your article here... Use H2 and H3 headings for the table of contents." /></div>
        </>
      )}

      {tab === 'seo' && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(255,128,0,0.06)', borderColor: 'rgba(255,128,0,0.2)' }}>
            <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Leave blank to use the post title and excerpt automatically.</p>
          </div>
          <div className="field"><label>SEO Title <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(max 60 chars)</span></label><input value={post.meta_title || ''} onChange={e => set('meta_title', e.target.value)} maxLength={60} /></div>
          <div className="field"><label>Meta Description <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(max 160 chars)</span></label><textarea value={post.meta_description || ''} onChange={e => set('meta_description', e.target.value)} rows={3} maxLength={160} /></div>
        </>
      )}
    </div>
  )
}
