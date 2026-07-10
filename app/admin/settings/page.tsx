'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, User, Mail, MapPin, GitBranch, Link2, Globe, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

const profileSchema = z.object({
  name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  bio: z.string().min(10, 'Bio too short'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  behanceUrl: z.string().url().optional().or(z.literal('')),
  dribbbleUrl: z.string().url().optional().or(z.literal('')),
  yearsExp: z.number().int().min(0),
  projectsDone: z.number().int().min(0),
  happyClients: z.number().int().min(0),
  techMastered: z.number().int().min(0),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Enter your current password'),
  newPassword: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export default function AdminSettingsPage() {
  const [avatar, setAvatar] = useState('')
  const [profileStatus, setProfileStatus] = useState<SaveStatus>('idle')
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>('idle')
  const [passwordError, setPasswordError] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Sanjay',
      title: 'Full Stack Developer & UI/UX Designer',
      bio: 'I craft digital experiences that are both beautiful and functional. Specializing in modern web development and intuitive design, I bring ideas to life with clean code and thoughtful interfaces.',
      email: 'sanjay@example.com',
      location: 'Tamil Nadu, India',
      githubUrl: 'https://github.com/sanjay',
      linkedinUrl: 'https://linkedin.com/in/sanjay',
      behanceUrl: 'https://behance.net/sanjay',
      dribbbleUrl: 'https://dribbble.com/sanjay',
      yearsExp: 2,
      projectsDone: 15,
      happyClients: 10,
      techMastered: 20,
    },
  })

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()

        if (data) {
          profileForm.reset(data)
          setAvatar(data.avatar || '')
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadProfile()
  }, [])

  const saveProfile = async (data: ProfileData) => {
    setProfileStatus('saving')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, avatar: avatar || null }),
      })
      if (!res.ok) throw new Error()
      setProfileStatus('success')
      setTimeout(() => setProfileStatus('idle'), 3000)
    } catch {
      setProfileStatus('error')
      setTimeout(() => setProfileStatus('idle'), 3000)
    }
  }

  const changePassword = async (data: PasswordData) => {
    setPasswordStatus('saving')
    setPasswordError('')
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setPasswordStatus('success')
      passwordForm.reset()
      setTimeout(() => setPasswordStatus('idle'), 3000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password')
      setPasswordStatus('error')
      setTimeout(() => setPasswordStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>Manage your profile and account settings</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={profileForm.handleSubmit(saveProfile)} className="card-glass p-6 space-y-5">
        <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>Profile Information</h2>

        {/* Avatar */}
        <ImageUploader
          value={avatar}
          onChange={setAvatar}
          folder="portfolio/avatar"
          label="Profile Photo"
          aspectRatio="1/1"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
              <input {...profileForm.register('name')} className="input-field pl-10" />
            </div>
            {profileForm.formState.errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{profileForm.formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
              <input {...profileForm.register('email')} type="email" className="input-field pl-10" />
            </div>
            {profileForm.formState.errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{profileForm.formState.errors.email.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Professional Title</label>
            <input {...profileForm.register('title')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
              <input {...profileForm.register('location')} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Phone (optional)</label>
            <input {...profileForm.register('phone')} type="tel" placeholder="+91 XXXXX XXXXX" className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Bio</label>
          <textarea {...profileForm.register('bio')} rows={4} className="input-field resize-none" />
          {profileForm.formState.errors.bio && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{profileForm.formState.errors.bio.message}</p>}
        </div>

        {/* Social links */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium" style={{ color: '#9898B0' }}>Social Links</h3>
          {[
            { icon: GitBranch, field: 'githubUrl' as const, label: 'GitHub', placeholder: 'https://github.com/username' },
            { icon: Link2, field: 'linkedinUrl' as const, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
            { icon: Globe, field: 'behanceUrl' as const, label: 'Behance', placeholder: 'https://behance.net/username' },
            { icon: Globe, field: 'dribbbleUrl' as const, label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
          ].map(({ icon: Icon, field, label, placeholder }) => (
            <div key={field}>
              <label className="block text-xs mb-1" style={{ color: '#5E5E7A' }}>{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
                <input {...profileForm.register(field)} type="url" placeholder={placeholder} className="input-field pl-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-sm font-medium mb-3" style={{ color: '#9898B0' }}>Homepage Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { label: 'Years Exp.', field: 'yearsExp' as const },
              { label: 'Projects', field: 'projectsDone' as const },
              { label: 'Clients', field: 'happyClients' as const },
              { label: 'Technologies', field: 'techMastered' as const },
            ]).map(({ label, field }) => (
              <div key={field} className="text-center">
                <label className="block text-xs mb-1" style={{ color: '#5E5E7A' }}>{label}</label>
                <input {...profileForm.register(field, { valueAsNumber: true })} type="number" min={0} className="input-field text-center font-bold" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={profileStatus === 'saving'} className="btn-primary">
          {profileStatus === 'saving' ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : profileStatus === 'success' ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : profileStatus === 'error' ? (
            <><AlertCircle className="w-4 h-4" /> Error — try again</>
          ) : (
            <><Save className="w-4 h-4" /> Save Profile</>
          )}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={passwordForm.handleSubmit(changePassword)} className="card-glass p-6 space-y-4">
        <h2 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>Change Password</h2>
        <p className="text-sm" style={{ color: '#5E5E7A' }}>
          Use a strong password with uppercase, numbers, and symbols.
        </p>

        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
            <input {...passwordForm.register('currentPassword')} type={showCurrent ? 'text' : 'password'} className="input-field pl-10 pr-10" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#5E5E7A' }}>
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordForm.formState.errors.currentPassword && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{passwordForm.formState.errors.currentPassword.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
              <input {...passwordForm.register('newPassword')} type={showNew ? 'text' : 'password'} className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#5E5E7A' }}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{passwordForm.formState.errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#9898B0' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5E5E7A' }} />
              <input {...passwordForm.register('confirmPassword')} type="password" className="input-field pl-10" />
            </div>
            {passwordForm.formState.errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{passwordForm.formState.errors.confirmPassword.message}</p>}
          </div>
        </div>

        {passwordError && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {passwordError}
          </div>
        )}

        <button type="submit" disabled={passwordStatus === 'saving'} className="btn-outline">
          {passwordStatus === 'saving' ? (
            <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Updating...</>
          ) : passwordStatus === 'success' ? (
            <><CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} /> Password changed!</>
          ) : (
            <><Lock className="w-4 h-4" /> Update Password</>
          )}
        </button>
      </form>
    </div>
  )
}
