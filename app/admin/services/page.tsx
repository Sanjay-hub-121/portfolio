'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Service = { id: string; title: string; description: string; icon: string; features: string[]; order: number }
const empty = { title: '', description: '', icon: 'code', features: '', order: 0 }

export default function AdminServicesPage() {
  const { data, isLoading, create, update, remove } = useCrud<Service>({ endpoint: '/api/services' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openEdit = (s: Service) => {
    setForm({ title: s.title, description: s.description, icon: s.icon, features: s.features.join(', '), order: s.order })
    setEditId(s.id); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = { ...form, features: form.features.split(',').map((f) => f.trim()).filter(Boolean) }
    if (editId) await update(editId, payload)
    else await create(payload as Parameters<typeof create>[0])
    setSaving(false); setShowForm(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true); await remove(deleteId); setDeleting(false); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Services</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{data.length} services listed</p>
        </div>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Service</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...data].sort((a, b) => a.order - b.order).map((s) => (
            <div key={s.id} className="card-glass p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{s.title}</h3>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9898B0' }}>{s.description}</p>
              <div className="space-y-1.5">
                {s.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#9898B0' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6366F1' }} />{f}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 text-xs font-mono" style={{ borderTop: '1px solid #252540', color: '#5E5E7A' }}>
                icon: {s.icon} · order: {s.order}
              </div>
            </div>
          ))}
          {data.length === 0 && <div className="col-span-full card-glass p-12 text-center text-sm" style={{ color: '#5E5E7A' }}>No services yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit' : 'Add'} Service</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. UI Design" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Icon (Lucide name)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="layout, code, users..." className="input-field font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Features <span style={{ color: '#5E5E7A' }}>(comma-separated)</span></label>
              <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Design Systems, Component Libraries, Brand Identity" className="input-field" />
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
        <ConfirmDialog title="Delete Service" message={`Delete "${data.find((d) => d.id === deleteId)?.title}"?`}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting} />
      )}
    </div>
  )
}
