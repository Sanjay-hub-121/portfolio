'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, GraduationCap, Calendar } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Education = { id: string; institution: string; degree: string; startDate: string; endDate: string | null; description: string | null }
const empty = { institution: '', degree: '', startDate: '', endDate: '', description: '' }

export default function AdminEducationPage() {
  const { data, isLoading, create, update, remove } = useCrud<Education>({ endpoint: '/api/education' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openEdit = (e: Education) => {
    setForm({ institution: e.institution, degree: e.degree, startDate: e.startDate?.slice(0, 10) ?? '', endDate: e.endDate?.slice(0, 10) ?? '', description: e.description ?? '' })
    setEditId(e.id); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.institution.trim() || !form.degree.trim()) return
    setSaving(true)
    const payload = { ...form, endDate: form.endDate || null, description: form.description || null }
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
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Education</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{data.length} entries</p>
        </div>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Education</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : (
        <div className="space-y-4">
          {data.map((edu) => (
            <div key={edu.id} className="card-glass p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                    <GraduationCap className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{edu.degree}</h3>
                      {!edu.endDate && <span className="text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>Pursuing</span>}
                    </div>
                    <div className="text-sm font-medium mb-2" style={{ color: '#8B5CF6' }}>{edu.institution}</div>
                    <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: '#5E5E7A' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(edu.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}
                    </div>
                    {edu.description && <p className="text-sm" style={{ color: '#9898B0' }}>{edu.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(edu)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(edu.id)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <div className="card-glass p-12 text-center text-sm" style={{ color: '#5E5E7A' }}>No education entries yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit' : 'Add'} Education</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Institution *</label>
              <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="University / College name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Degree *</label>
              <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="e.g. M.Sc. Computer Science" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>End Date <span style={{ color: '#5E5E7A' }}>(leave blank if ongoing)</span></label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Description / CGPA (optional)</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
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
        <ConfirmDialog title="Delete Education" message={`Delete "${data.find((d) => d.id === deleteId)?.institution}"?`}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting} />
      )}
    </div>
  )
}
