'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Calendar, Briefcase } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Experience = { id: string; company: string; position: string; startDate: string; endDate: string | null; description: string; technologies: string[]; current: boolean }

const empty = { company: '', position: '', startDate: '', endDate: '', description: '', technologies: '', current: false }

export default function AdminExperiencePage() {
  const { data, isLoading, create, update, remove } = useCrud<Experience>({ endpoint: '/api/experience' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openAdd = () => { setForm(empty); setEditId(null); setShowForm(true) }
  const openEdit = (e: Experience) => {
    setForm({ company: e.company, position: e.position, startDate: e.startDate?.slice(0, 10) ?? '', endDate: e.endDate?.slice(0, 10) ?? '', description: e.description, technologies: e.technologies.join(', '), current: e.current })
    setEditId(e.id); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.company.trim() || !form.position.trim()) return
    setSaving(true)
    const payload = { ...form, technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean), endDate: form.endDate || null }
    if (editId) await update(editId, payload)
    else await create(payload as Parameters<typeof create>[0])
    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await remove(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Experience</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{data.length} entries</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Experience</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : (
        <div className="space-y-4">
          {data.map((exp) => (
            <div key={exp.id} className="card-glass p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(99,102,241,0.1)' }}>
                    <Briefcase className="w-5 h-5" style={{ color: '#6366F1' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{exp.position}</h3>
                      {exp.current && <span className="text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>Current</span>}
                    </div>
                    <div className="text-sm font-medium mb-2" style={{ color: '#6366F1' }}>{exp.company}</div>
                    <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: '#5E5E7A' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(exp.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}
                    </div>
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: '#9898B0' }}>{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>{t}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(exp.id)} className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <div className="card-glass p-12 text-center text-sm" style={{ color: '#5E5E7A' }}>No experience entries yet. Add your first one.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit' : 'Add'} Experience</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Company *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Position *</label>
                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Job title" className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} className="input-field disabled:opacity-50" />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#141420', border: '1px solid #252540' }}>
              <input type="checkbox" id="current" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: '' })} className="w-4 h-4 accent-indigo-500" />
              <label htmlFor="current" className="text-sm cursor-pointer" style={{ color: '#9898B0' }}>I currently work here</label>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe your role and achievements..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Technologies <span style={{ color: '#5E5E7A' }}>(comma-separated)</span></label>
              <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, Figma..." className="input-field" />
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
        <ConfirmDialog
          title="Delete Experience"
          message={`Delete "${data.find((d) => d.id === deleteId)?.company}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting}
        />
      )}
    </div>
  )
}
