'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'

interface Post { id: string; title: string; category: string; published: boolean; published_at: string }

export default function NewsPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    supabase.from('posts').select('id,title,category,published,published_at').order('published_at', { ascending: false }).then(({ data }) => { if (data) setPosts(data) })
  }, [])

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from('posts').update({ published }).eq('id', id)
    setPosts(p => p.map(x => x.id === id ? { ...x, published } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts(p => p.filter(x => x.id !== id))
    show('Post deleted', 'success')
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>📰 News / Blog</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{posts.length} posts</p>
        </div>
        <Link href="/760/news/new" className="btn btn-orange">+ New post</Link>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Date</th><th>Published</th><th></th></tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem' }}>No posts yet</td></tr>}
            {posts.map(post => (
              <tr key={post.id}>
                <td><Link href={`/760/news/${post.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{post.title}</Link></td>
                <td>{post.category ? <span className="badge badge-orange">{post.category}</span> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}</td>
                <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td><label className="toggle"><input type="checkbox" checked={post.published} onChange={e => togglePublished(post.id, e.target.checked)} /><span className="toggle-slider" /></label></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/760/news/${post.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(post.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
