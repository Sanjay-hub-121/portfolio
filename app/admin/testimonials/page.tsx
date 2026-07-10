'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Star, Users, AlertCircle } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'

type Testimonial = { id: string; name: string; company: string; position: string; review: string; rating: number; imageUrl: string | null; featured: boolean }
const empty = { name: '', company: '', position: '', review: '', rating: 5, imageUrl: '', featured: false }

export default function AdminTestimonialsPage() {
  const { data, isLoading, error, create, update, remove } = useCrud<Testimonial>({ endpoint: '/api/testimonials' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openEdit = (t: Testimonial) => {
    setForm({ name: t.name, company: t.company, position: t.position, review: t.review, rating: t.rating, imageUrl: t.imageUrl ?? '', featured: t.featured })
    setEditId(t.id); setFormError(null); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) return

    if (form.review.trim().length < 10) {
      setFormError('Review must be at least 10 characters.')
      return
    }

    setSaving(true)
    setFormError(null)
    const payload = { ...form, imageUrl: form.imageUrl || null }

    const result = editId
      ? await update(editId, payload)
      : await create(payload as Parameters<typeof create>[0])

    setSaving(false)

    if (result) {
      setShowForm(false)
    } else {
      // create()/update() failed — keep the form open and show why, instead of
      // silently closing as if nothing happened.
      setFormError(error ?? 'Failed to save. Please check the fields and try again.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true); await remove(deleteId); setDeleting(false); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Testimonials</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{data.length} reviews</p>
        </div>
        <button onClick={() => { setForm(empty); setEditId(null); setFormError(null); setShowForm(true) }} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Testimonial</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : data.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#5E5E7A' }} />
          <p className="text-sm mb-1" style={{ color: '#5E5E7A' }}>No testimonials yet</p>
          <p className="text-xs" style={{ color: '#5E5E7A' }}>Ask satisfied clients for a review and add them here to build social proof.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((t) => (
            <div key={t.id} className="card-glass p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {t.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>{t.name[0]}</div>
                  }
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#F1F1F5' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#5E5E7A' }}>{t.position} @ {t.company}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: i < t.rating ? '#fbbf24' : '#252540', fill: i < t.rating ? '#fbbf24' : 'transparent' }} />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9898B0' }}>&ldquo;{t.review}&rdquo;</p>
              {t.featured && <div className="mt-3 text-xs" style={{ color: '#6366F1' }}>⭐ Featured</div>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="portfolio/testimonials" label="Client Photo (optional)" aspectRatio="1/1" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Company *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Position *</label>
              <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Founder, CEO" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Review * <span style={{ color: '#5E5E7A' }}>(min. 10 characters)</span></label>
              <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={4} placeholder="What did the client say..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: '#9898B0' }}>Rating: <span style={{ color: '#fbbf24' }}>{form.rating}/5</span></label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="transition-transform hover:scale-110">
                    <Star className="w-6 h-6" style={{ color: n <= form.rating ? '#fbbf24' : '#252540', fill: n <= form.rating ? '#fbbf24' : 'transparent' }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#141420', border: '1px solid #252540' }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-indigo-500" />
              <label htmlFor="featured" className="text-sm cursor-pointer" style={{ color: '#9898B0' }}>Feature on homepage</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center text-sm py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm py-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog title="Delete Testimonial" message={`Delete review from "${data.find((d) => d.id === deleteId)?.name}"?`}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting} />
      )}
    </div>
  )
}
