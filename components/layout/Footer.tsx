'use client'

import Link from 'next/link'
import { GitBranch, Link2, Mail, Code2, ExternalLink } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const profile = useProfile()
  const year = new Date().getFullYear()

  const socialLinks = [
    { icon: GitBranch, href: profile?.githubUrl, label: 'GitHub' },
    { icon: Link2, href: profile?.linkedinUrl, label: 'LinkedIn' },
    { icon: Mail, href: profile?.email ? `mailto:${profile.email}` : undefined, label: 'Email' },
  ].filter((link) => link.href)

  return (
    <footer className="bg-deep border-t border-[#252540]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-text-primary">
                sanjay<span className="text-primary">.</span>dev
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              {profile?.title || 'Full Stack Developer & UI/UX Designer'} crafting premium digital experiences
              {profile?.location ? ` from ${profile.location}.` : '.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary font-medium text-sm mb-4">Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-muted hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-text-primary font-medium text-sm mb-4">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-elevated border border-[#252540] flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#252540] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-text-muted text-sm">
            © {year} {profile?.name || 'Sanjay'}. All rights reserved.
          </p>
          <p className="text-text-muted text-xs font-mono">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
