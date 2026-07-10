'use client'

import { useState } from 'react'
import { Plus, GitBranch, ExternalLink, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ProjectFormModal from '@/components/admin/ProjectFormModal'

interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail: string
  category: string
  featured: boolean
  technologies: string[]
  liveUrl: string | null
  githubUrl: string | null
}

export default function AdminProjectsPage() {
  const { data: projects, isLoading, remove, refetch } = useCrud<Project>({ endpoint: '/api/projects' })
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openAdd = () => {
    setEditingProject(null)
    setShowModal(true)
  }

  const openEdit = (project: Project) => {
    setEditingProject(project)
    setShowModal(true)
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
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>{projects.length} total projects</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6366F1' }} />
        </div>
      ) : projects.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-sm" style={{ color: '#5E5E7A' }}>No projects yet. Click &ldquo;Add Project&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #252540' }}>
                {['Project', 'Category', 'Tech', 'Links', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: '#5E5E7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="transition-colors" style={{ borderBottom: '1px solid #252540' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(26,26,46,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: '#F1F1F5' }}>{p.title}</span>
                      {p.featured && <Star className="w-3.5 h-3.5" style={{ color: '#fbbf24', fill: '#fbbf24' }} />}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#141420', border: '1px solid #252540', color: '#9898B0' }}>{t}</span>
                      ))}
                      {p.technologies.length > 2 && <span className="text-xs" style={{ color: '#5E5E7A' }}>+{p.technologies.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5E5E7A' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F1F5')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#5E5E7A')}>
                          <GitBranch className="w-4 h-4" />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5E5E7A' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F1F5')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#5E5E7A')}>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {!p.githubUrl && !p.liveUrl && <span className="text-xs" style={{ color: '#5E5E7A' }}>—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: '#5E5E7A' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setEditingProject(null)
            refetch()
          }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Project"
          message={`Delete "${projects.find((p) => p.id === deleteId)?.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleting}
        />
      )}
    </div>
  )
}
