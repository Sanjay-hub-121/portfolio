'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-red-400 transition-all text-sm w-full"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
