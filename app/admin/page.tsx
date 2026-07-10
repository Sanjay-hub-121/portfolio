import { FolderKanban, MessageSquare, Users, Code2, ExternalLink, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [projectCount, skillCount, testimonialCount, unreadCount, profile] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.profile.findFirst(),
  ])

  const stats = [
    { label: 'Total Projects', value: projectCount, icon: FolderKanban, href: '/admin/projects', color: 'text-primary bg-primary/10' },
    { label: 'Skills Listed', value: skillCount, icon: Code2, href: '/admin/skills', color: 'text-violet-400 bg-violet-400/10' },
    { label: 'Testimonials', value: testimonialCount, icon: Users, href: '/admin/testimonials', color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Unread Messages', value: unreadCount, icon: MessageSquare, href: '/admin/messages', color: 'text-amber-400 bg-amber-400/10' },
  ]

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects/new', icon: FolderKanban },
    { label: 'View Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Update Skills', href: '/admin/skills', icon: Code2 },
    { label: 'Live Portfolio', href: '/', icon: ExternalLink, external: true },
  ]

  // --- Real setup checklist conditions ---
  // 1. DATABASE_URL is set at all
  const hasDatabaseUrl = !!process.env.DATABASE_URL

  // 2. If the counts above ran without throwing, `prisma db push` has already
  //    succeeded — the schema exists and is reachable. No separate check needed.
  const schemaPushed = true

  // 3. Seed has run if a Profile row exists (seed.ts always creates exactly one)
  const seeded = !!profile

  // 4. SMTP is configured if all three required env vars are present
  const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

  // 5. Vercel automatically sets the VERCEL env var at build/runtime when deployed there
  const deployed = !!process.env.VERCEL

  // 6. Profile still has placeholder data if the email is still the seed default
  const profileUpdated = !!profile && !profile.email.endsWith('@example.com')

  const checklist = [
    { done: hasDatabaseUrl, text: 'Configure DATABASE_URL in .env (Neon PostgreSQL)' },
    { done: schemaPushed, text: 'Run: npx prisma db push' },
    { done: seeded, text: 'Run: npx ts-node prisma/seed.ts' },
    { done: smtpConfigured, text: 'Configure SMTP settings for contact form emails' },
    { done: deployed, text: 'Deploy to Vercel and set environment variables' },
    { done: profileUpdated, text: 'Update profile info and add your real projects' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted mt-1 text-sm">Welcome back, Sanjay. Here&apos;s an overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="card-glass p-5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-display font-bold text-text-primary">{value}</div>
            <div className="text-text-muted text-sm mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-glass p-6">
        <h2 className="font-display font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ label, href, icon: Icon, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-[#252540] hover:border-primary/50 hover:text-primary text-text-secondary transition-all text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="card-glass p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="glow-dot" />
          <span className="text-sm font-medium text-text-primary">Setup Checklist</span>
        </div>
        <div className="space-y-2 text-sm text-text-muted">
          {checklist.map(({ done, text }) => (
            <div key={text} className="flex items-start gap-2">
              <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${done ? 'bg-primary border-primary' : 'border-[#252540]'}`}>
                {done && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={done ? 'line-through text-text-muted/50' : ''}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
