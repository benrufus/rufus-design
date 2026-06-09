'use client'
import { useState } from 'react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (data.url) onChange(data.url)
    setUploading(false)
  }

  return (
    <div className="cms-field">
      <label>{label}</label>
      {value && (
        <img src={value} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} />
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', fontSize: '0.8rem' }} />
      {uploading && <p style={{ fontSize: '0.75rem', color: 'var(--orange)', marginTop: '0.4rem' }}>Uploading…</p>}
    </div>
  )
}
