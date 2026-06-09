'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import { SortableList } from '@/components/ui/SortableList'
import ImageUpload from '@/components/ui/ImageUpload'

interface Stat { id: string; value: string; label: string; sort_order: number; page: string }
interface Value { id: string; number: string; title: string; description: string; sort_order: number }
interface TeamMember { id: string; name: string; role: string; bio: string; photo: string; sort_order: number; active: boolean }
interface AboutPage { id: string; heading: string; intro: string }

export default function AboutEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [about, setAbout] = useState<AboutPage | null>(null)
  const [stats, setStats] = useState<Stat[]>([])
  const [values, setValues] = useState<Value[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'page' | 'stats' | 'values' | 'team'>('page')

  useEffect(() => {
    Promise.all([
      supabase.from('about_page').select('*').single(),
      supabase.from('stats').select('*').eq('page', 'about').order('sort_order'),
      supabase.from('values_items').select('*').order('sort_order'),
      supabase.from('team').select('*').order('sort_order'),
    ]).then(([{ data: a }, { data: s }, { data: v }, { data: t }]) => {
      if (a) setAbout(a)
      if (s) setStats(s)
      if (v) setValues(v)
      if (t) setTeam(t)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    if (tab === 'page' && about) {
      await supabase.from('about_page').update(about).eq('id', about.id)
    } else if (tab === 'stats') {
      await Promise.all(stats.map((s, i) => supabase.from('stats').update({ value: s.value, label: s.label, sort_order: i }).eq('id', s.id)))
    } else if (tab === 'values') {
      await Promise.all(values.map((v, i) => supabase.from('values_items').update({ number: v.number, title: v.title, description: v.description, sort_order: i }).eq('id', v.id)))
    } else if (tab === 'team') {
      await Promise.all(team.map((t, i) => supabase.from('team').update({ name: t.name, role: t.role, bio: t.bio, photo: t.photo, sort_order: i, active: t.active }).eq('id', t.id)))
    }
    show('Saved!', 'success')
    setSaving(false)
  }

  const addTeamMember = async () => {
    const { data } = await supabase.from('team').insert({ name: 'New Team Member', role: '', bio: '', sort_order: team.length, active: true }).select().single()
    if (data) setTeam(t => [...t, data])
  }

  const removeTeamMember = async (id: string) => {
    await supabase.from('team').delete().eq('id', id)
    setTeam(t => t.filter(x => x.id !== id))
  }

  const TAB = (t: typeof tab) => ({ padding: '0.5rem 1rem', background: tab === t ? 'rgba(255,128,0,0.15)' : 'transparent', border: tab === t ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.08)', color: tab === t ? '#ff8000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '6px', fontSize: '0.825rem', fontWeight: tab === t ? 600 : 400 })

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>👋 About Page</h1>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button style={TAB('page')} onClick={() => setTab('page')}>📝 Page copy</button>
        <button style={TAB('stats')} onClick={() => setTab('stats')}>📊 Stats</button>
        <button style={TAB('values')} onClick={() => setTab('values')}>⊞ Values</button>
        <button style={TAB('team')} onClick={() => setTab('team')}>👤 Team</button>
      </div>

      {tab === 'page' && about && (
        <>
          <div className="field"><label>Page heading</label><input value={about.heading} onChange={e => setAbout(a => a ? { ...a, heading: e.target.value } : a)} /></div>
          <div className="field"><label>Intro paragraph</label><textarea value={about.intro} onChange={e => setAbout(a => a ? { ...a, intro: e.target.value } : a)} rows={4} /></div>
        </>
      )}

      {tab === 'stats' && (
        <SortableList items={stats} onChange={setStats} renderItem={(stat) => (
          <div className="card-sm">
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
              <div className="field" style={{ margin: 0 }}><label>Value</label><input value={stat.value} onChange={e => setStats(ss => ss.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))} /></div>
              <div className="field" style={{ margin: 0 }}><label>Label</label><input value={stat.label} onChange={e => setStats(ss => ss.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))} /></div>
            </div>
          </div>
        )} />
      )}

      {tab === 'values' && (
        <SortableList items={values} onChange={setValues} renderItem={(value) => (
          <div className="card-sm">
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div className="field" style={{ margin: 0 }}><label>Number</label><input value={value.number} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, number: e.target.value } : v))} /></div>
              <div className="field" style={{ margin: 0 }}><label>Title</label><input value={value.title} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, title: e.target.value } : v))} /></div>
            </div>
            <div className="field" style={{ margin: 0 }}><label>Description</label><textarea value={value.description} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, description: e.target.value } : v))} rows={2} /></div>
          </div>
        )} />
      )}

      {tab === 'team' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={addTeamMember}>+ Add team member</button>
          </div>
          <SortableList items={team} onChange={setTeam} renderItem={(member) => (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <label className="toggle"><input type="checkbox" checked={member.active} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, active: e.target.checked } : t))} /><span className="toggle-slider" /></label>
                  Visible on site
                </label>
                <button className="btn btn-danger btn-sm" onClick={() => removeTeamMember(member.id)}>Delete</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="field" style={{ margin: 0 }}><label>Name</label><input value={member.name} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, name: e.target.value } : t))} /></div>
                <div className="field" style={{ margin: 0 }}><label>Role</label><input value={member.role || ''} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, role: e.target.value } : t))} /></div>
              </div>
              <div className="field" style={{ margin: 0, marginBottom: '0.75rem' }}><label>Bio</label><textarea value={member.bio || ''} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, bio: e.target.value } : t))} rows={3} /></div>
              <ImageUpload value={member.photo || ''} onChange={url => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, photo: url } : t))} folder="team" label="Photo" />
            </div>
          )} />
        </>
      )}
    </div>
  )
}
