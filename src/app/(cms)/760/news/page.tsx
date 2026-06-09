'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsNewsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('posts').select('*').order('published_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function addNew() {
    const slug = `post-${Date.now()}`
    const { data } = await supabase.from('posts').insert({ title: 'New Post', slug, published: false }).select().single()
    if (data) { setItems([data, ...items]); toast('Created') }
  }

  async function toggle(id: string, val: boolean) {
    await supabase.from('posts').update({ published: val }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, published: val } : i))
    toast('Updated')
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast('Deleted')
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>News / Blog<span style={{ color: 'var(--orange)' }}>.</span></h1>
          <p>{items.length} posts</p>
        </div>
        <button className="cms-btn" onClick={addNew}>+ New post</button>
      </div>

      {items.map(item => (
        <div key={item.id} className="cms-list-item">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              {item.published_at ? new Date(item.published_at).toLocaleDateString('en-GB') : 'No date'} · /{item.slug}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`cms-badge ${item.published ? 'cms-badge-published' : 'cms-badge-draft'}`}>{item.published ? 'Live' : 'Draft'}</span>
            <button onClick={() => toggle(item.id, !item.published)} className="cms-btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.7rem' }}>
              {item.published ? 'Unpublish' : 'Publish'}
            </button>
            <Link href={`/760/news/${item.id}`} className="cms-btn" style={{ padding: '0.4rem 0.875rem', fontSize: '0.7rem', textDecoration: 'none' }}>Edit</Link>
            <button onClick={() => remove(item.id)} className="cms-btn-danger">✕</button>
          </div>
        </div>
      ))}

      {!items.length && <div style={{ color: 'var(--muted)', padding: '3rem', textAlign: 'center' }}>No posts yet. Add one above.</div>}
    </>
  )
}
