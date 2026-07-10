'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Users,
  Code2,
  Settings,
} from 'lucide-react'

interface AdminNavLinkProps {
  href: string
  label: string
  icon: string
}

const icons = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  skills: Code2,
  services: Wrench,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  testimonials: Users,
  messages: MessageSquare,
  settings: Settings,
}

export default function AdminNavLink({
  href,
  label,
  icon,
}: AdminNavLinkProps) {
  const pathname = usePathname()

  const isActive =
    href === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(href)

  const Icon = icons[icon as keyof typeof icons]

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{
        color: isActive ? '#F1F1F5' : '#9898B0',
        backgroundColor: isActive ? '#252540' : 'transparent',
      }}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0 transition-colors"
        style={{ color: isActive ? '#6366F1' : 'inherit' }}
      />

      {label}

      {isActive && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#6366F1' }}
        />
      )}
    </Link>
  )
}