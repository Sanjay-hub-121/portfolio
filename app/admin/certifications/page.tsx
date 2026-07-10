'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Award, ExternalLink } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'

type Cert = { id: string; title: string; organization: string; issueDate: string; credentialUrl: string | null; imageUrl: string | null }
const empty = { title: '', organization: '', issueDate: '', credentialUrl: '', imageUrl: '' }

export default function AdminCertificationsPage() {
  const { data, isLoading, create, update, remove } = useCrud<Cert>({ endpoint: '/api/certifications' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openEdit = (c: Cert) => {
    setForm({ title: c.title, organization: c.organization, issueDate: c.issueDate?.slice(0, 10) ?? '', credentialUrl: c.credentialUrl ?? '', imageUrl: c.imageUrl ?? '' })
    setEditId(c.id); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.organization.trim()) return
    setSaving(true)
    const payload = { ...form, credentialUrl: form.credentialUrl || null, imageUrl: form.imageUrl || null }
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
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Certifications</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{data.length} certificates</p>
        </div>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }} className="btn-primary text-sm"><Plus className="w-4 h-4" />Add Certificate</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((cert) => (
            <div key={cert.id} className="card-glass p-5 hover:border-primary/30 transition-colors">
              {cert.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-32 object-cover rounded-lg mb-4" />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}>
                    <Award className="w-4 h-4" style={{ color: '#fbbf24' }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm mb-1 leading-tight" style={{ color: '#F1F1F5' }}>{cert.title}</h3>
                    <div className="text-xs mb-1" style={{ color: '#6366F1' }}>{cert.organization}</div>
                    <div className="text-xs mb-2" style={{ color: '#5E5E7A' }}>
                      {new Date(cert.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs hover:underline" style={{ color: '#6366F1' }}>
                        <ExternalLink className="w-3 h-3" />View Credential
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(cert)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(cert.id)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full card-glass p-12 text-center">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#5E5E7A' }} />
              <p className="text-sm" style={{ color: '#5E5E7A' }}>No certifications yet. Add your Google, Meta, or other certificates.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{editId ? 'Edit' : 'Add'} Certificate</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg" style={{ color: '#5E5E7A' }}><X className="w-4 h-4" /></button>
            </div>
            <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="portfolio/certifications" label="Certificate Image (optional)" aspectRatio="4/3" />
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Certificate Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Google UX Design Certificate" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Issuing Organization *</label>
              <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g. Google / Coursera" className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Issue Date *</label>
              <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Credential URL (optional)</label>
              <input type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://coursera.org/verify/..." className="input-field" />
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
        <ConfirmDialog title="Delete Certificate" message={`Delete "${data.find((d) => d.id === deleteId)?.title}"?`}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting} />
      )}
    </div>
  )
}
