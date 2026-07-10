import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import SignOutButton from '@/components/admin/SignOutButton'
import AdminNavLink from '@/components/admin/AdminNavLink'
import { Code2, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/projects', label: 'Projects', icon: 'projects' },
  { href: '/admin/skills', label: 'Skills', icon: 'skills' },
  { href: '/admin/services', label: 'Services', icon: 'services' },
  { href: '/admin/experience', label: 'Experience', icon: 'experience' },
  { href: '/admin/education', label: 'Education', icon: 'education' },
  { href: '/admin/certifications', label: 'Certifications', icon: 'certifications' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
  { href: '/admin/messages', label: 'Messages', icon: 'messages' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col fixed top-0 left-0 h-full z-40"
        style={{ backgroundColor: '#0F0F1A', borderRight: '1px solid #252540' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 flex-shrink-0"
          style={{ borderBottom: '1px solid #252540' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: '#F1F1F5' }}>
              sanjay<span style={{ color: '#6366F1' }}>.</span>admin
            </span>
          </div>
        </div>

        {/* Session user badge */}
        {session?.user && (
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #252540' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
              >
                {session.user.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: '#F1F1F5' }}>
                  {session.user.email}
                </div>
                <div className="text-xs" style={{ color: '#5E5E7A' }}>Administrator</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 flex-shrink-0 space-y-0.5" style={{ borderTop: '1px solid #252540' }}>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-elevated"
            style={{ color: '#5E5E7A' }}
          >
            <ExternalLink className="w-4 h-4" />
            View Portfolio
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main — offset by sidebar width */}
      <main className="flex-1 overflow-auto" style={{ marginLeft: '240px' }}>
        <div className="p-6 lg:p-8 min-h-screen">{children}</div>
      </main>
    </div>
  )
}
