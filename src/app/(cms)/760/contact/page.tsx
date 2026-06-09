'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import { SortableList } from '@/components/ui/SortableList'

interface Field { name: string; label: string; type: string; required: boolean; width: 'half' | 'full' }
interface ContactForm { id: string; heading: string; subtext: string; recipient_email: string; success_message: string; fields: Field[] }

const FIELD_TYPES = ['text', 'email', 'tel', 'textarea', 'select']

export default function ContactFormEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [form, setForm] = useState<ContactForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('contact_form').select('*').single().then(({ data }) => { if (data) setForm({ ...data, fields: data.fields || [] }) })
  }, [])

  const save = async () => {
    if (!form) return
    setSaving(true)
    const { error } = await supabase.from('contact_form').update({ ...form, updated_at: new Date().toISOString() }).eq('id', form.id)
    show(error ? 'Error saving' : 'Contact form saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  const addField = () => {
    if (!form) return
    const newField: Field = { name: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false, width: 'full' }
    setForm(f => f ? { ...f, fields: [...f.fields, newField] } : f)
  }

  const updateField = (index: number, updates: Partial<Field>) => {
    setForm(f => f ? { ...f, fields: f.fields.map((field, i) => i === index ? { ...field, ...updates } : field) } : f)
  }

  const removeField = (index: number) => {
    setForm(f => f ? { ...f, fields: f.fields.filter((_, i) => i !== index) } : f)
  }

  if (!form) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  const fieldsWithIds = form.fields.map((f, i) => ({ ...f, id: f.name + i }))

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>✉️ Contact Form</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Edit form fields, labels and settings</p>
        </div>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      {/* Form settings */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Form settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="field" style={{ margin: 0 }}><label>Heading</label><input value={form.heading} onChange={e => setForm(f => f ? { ...f, heading: e.target.value } : f)} /></div>
          <div className="field" style={{ margin: 0 }}><label>Recipient email</label><input type="email" value={form.recipient_email} onChange={e => setForm(f => f ? { ...f, recipient_email: e.target.value } : f)} /></div>
        </div>
        <div className="field" style={{ marginTop: '1rem', marginBottom: 0 }}><label>Subtext</label><textarea value={form.subtext} onChange={e => setForm(f => f ? { ...f, subtext: e.target.value } : f)} rows={2} /></div>
        <div className="field" style={{ marginTop: '1rem', marginBottom: 0 }}><label>Success message</label><input value={form.success_message} onChange={e => setForm(f => f ? { ...f, success_message: e.target.value } : f)} /></div>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Form fields</h2>
        <button className="btn btn-ghost btn-sm" onClick={addField}>+ Add field</button>
      </div>

      <SortableList
        items={fieldsWithIds}
        onChange={newItems => setForm(f => f ? { ...f, fields: newItems.map(({ id: _id, ...rest }) => rest as Field) } : f)}
        renderItem={(field, index) => (
          <div className="card-sm">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <div className="field" style={{ margin: 0 }}><label>Label</label><input value={field.label} onChange={e => updateField(index, { label: e.target.value })} /></div>
              <div className="field" style={{ margin: 0 }}>
                <label>Type</label>
                <select value={field.type} onChange={e => updateField(index, { type: e.target.value })}>
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Width</label>
                <select value={field.width} onChange={e => updateField(index, { width: e.target.value as 'half' | 'full' })}>
                  <option value="full">Full width</option>
                  <option value="half">Half width</option>
                </select>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeField(index)} style={{ marginBottom: '1.25rem' }}>✕</button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <label className="toggle" style={{ transform: 'scale(0.85)' }}><input type="checkbox" checked={field.required} onChange={e => updateField(index, { required: e.target.checked })} /><span className="toggle-slider" /></label>
              Required field
            </label>
          </div>
        )}
      />
    </div>
  )
}
