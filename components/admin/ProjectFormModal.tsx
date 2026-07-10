'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, Save } from 'lucide-react'
import ImageUploader from './ImageUploader'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  shortDescription: z.string().min(10, 'Short description required'),
  description: z.string().min(20, 'Full description required'),
  category: z.string().min(1, 'Category is required'),
  technologies: z.string().min(1, 'Add at least one technology'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false).optional(),
})

type FormData = z.infer<typeof schema>

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

interface ProjectFormModalProps {
  project?: Project | null
  onClose: () => void
  onSuccess: () => void
}

const categories = ['Web Development', 'Full Stack', 'UI/UX Design', 'Mobile', 'Other']

export default function ProjectFormModal({ project, onClose, onSuccess }: ProjectFormModalProps) {
  const isEditing = !!project
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          description: project.description,
          category: project.category,
          technologies: project.technologies.join(', '),
          githubUrl: project.githubUrl ?? '',
          liveUrl: project.liveUrl ?? '',
          featured: project.featured,
        }
      : { featured: false },
  })

  // Auto-generate slug from title (only meaningful for new projects — editing keeps its existing slug editable but not auto-overwritten)
  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const technologies = data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      const payload = {
        ...data,
        thumbnail: thumbnail || '',
        technologies,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
      }

      const res = await fetch(
        isEditing ? `/api/projects/${project!.id}` : '/api/projects',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save project')
      onSuccess()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #252540' }}>
          <h2 className="text-lg font-display font-semibold" style={{ color: '#F1F1F5' }}>
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors"
            style={{ color: '#5E5E7A' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F1F1F5'; e.currentTarget.style.backgroundColor = '#252540' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Thumbnail */}
          <ImageUploader
            value={thumbnail}
            onChange={setThumbnail}
            folder="portfolio/projects"
            label="Project Thumbnail"
            aspectRatio="16/9"
          />

          {/* Title + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Title *</label>
              <input {...register('title')}
                placeholder="My Awesome Project"
                className="input-field"
                onChange={(e) => {
                  register('title').onChange(e)
                  if (!isEditing) setValue('slug', autoSlug(e.target.value))
                }}
              />
              {errors.title && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Slug *</label>
              <input {...register('slug')} placeholder="my-awesome-project" className="input-field font-mono text-sm" />
              {errors.slug && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.slug.message}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Category *</label>
            <select {...register('category')} className="input-field">
              <option value="">Select category...</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.category.message}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Short Description *</label>
            <input {...register('shortDescription')} placeholder="One-line summary for project cards" className="input-field" />
            {errors.shortDescription && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.shortDescription.message}</p>}
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Full Description *</label>
            <textarea {...register('description')} rows={4} placeholder="Detailed project description..." className="input-field resize-none" />
            {errors.description && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.description.message}</p>}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Technologies * <span className="text-xs" style={{ color: '#5E5E7A' }}>(comma-separated)</span></label>
            <input {...register('technologies')} placeholder="React, Next.js, TypeScript, Tailwind CSS" className="input-field" />
            {errors.technologies && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.technologies.message}</p>}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>GitHub URL</label>
              <input {...register('githubUrl')} type="url" placeholder="https://github.com/..." className="input-field" />
              {errors.githubUrl && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.githubUrl.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Live URL</label>
              <input {...register('liveUrl')} type="url" placeholder="https://..." className="input-field" />
              {errors.liveUrl && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.liveUrl.message}</p>}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#141420', border: '1px solid #252540' }}>
            <input {...register('featured')} type="checkbox" id="featured" className="w-4 h-4 rounded accent-indigo-500" />
            <label htmlFor="featured" className="text-sm cursor-pointer" style={{ color: '#9898B0' }}>
              Mark as <span style={{ color: '#F1F1F5' }}>featured project</span> (shown in hero carousel)
            </label>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> {isEditing ? 'Update Project' : 'Save Project'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
