'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Skill = { id: string; name: string; icon: string; category: string; percentage: number }

const categories = ['UI Design', 'UX Design', 'Frontend Development', 'Backend Development', 'Database', 'Tools', 'Design Tools']
const ALL = 'All'

const emptyForm = { name: '', icon: 'code', category: 'Frontend Development', percentage: 80 }

export default function AdminSkillsPage() {
  const { data: skills, isLoading, create, update, remove } = useCrud<Skill>({ endpoint: '/api/skills' })
  const [filter, setFilter] = useState(ALL)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = filter === ALL ? skills : skills.filter((s) => s.category === filter)

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (s: Skill) => { setForm({ name: s.name, icon: s.icon, category: s.category, percentage: s.percentage }); setEditId(s.id); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditId(null) }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    if (editId) await update(editId, form)
    else await create(form)
    setSaving(false)
    closeForm()
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
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Skills</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{skills.length} skills listed</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Skill</button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {[ALL, ...categories].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: filter === cat ? '#6366F1' : '#1A1A2E', color: filter === cat ? 'white' : '#9898B0', border: '1px solid', borderColor: filter === cat ? '#6366F1' : '#252540' }}>
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : (
        <div className="card-glass overflow-hidden">
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid #252540' }}>
              {['Skill', 'Category', 'Proficiency', 'Actions'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#5E5E7A' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((skill) => (
                <tr key={skill.id} style={{ borderBottom: '1px solid #252540' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(26,26,46,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: '#F1F1F5' }}>{skill.name}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>{skill.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#141420' }}>
                        <div className="h-full rounded-full" style={{ width: `${skill.percentage}%`, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }} />
                      </div>
                      <span className="text-xs w-8" style={{ color: '#5E5E7A' }}>{skill.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(skill.id)} className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: '#5E5E7A' }}>No skills in this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Skill Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. React" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Icon name (Lucide icon slug)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. code, database, wind" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Proficiency: <span style={{ color: '#6366F1' }}>{form.percentage}%</span></label>
              <input type="range" min={10} max={100} step={5} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#5E5E7A' }}><span>10%</span><span>100%</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeForm} className="btn-outline flex-1 justify-center text-sm py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary flex-1 justify-center text-sm py-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Skill"
          message={`Are you sure you want to delete "${skills.find((s) => s.id === deleteId)?.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleting}
        />
      )}
    </div>
  )
}
