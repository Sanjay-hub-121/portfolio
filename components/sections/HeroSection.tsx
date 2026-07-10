'use client'

import { motion, type Variants } from 'framer-motion'
import { GitBranch, Link2, Mail, ArrowDown, Download, ExternalLink, Pen } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import Image from 'next/image'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
}
export default function HeroSection() {
  const profile = useProfile()

  if (!profile) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        Loading profile...
      </section>
    )
  }

  const socialLinks = [
    {
      icon: GitBranch,
      href: profile.githubUrl,
      label: 'GitHub'
    },
    {
      icon: Link2,
      href: profile.linkedinUrl,
      label: 'LinkedIn'
    },
    {
      icon: Pen,
      href: profile.behanceUrl,
      label: 'Behance'
    },
    {
      icon: Mail,
      href: `mailto:${profile.email}`,
      label: 'Email'
    },
  ].filter(link => link.href)
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Status badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-[#252540] text-sm text-text-secondary mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
              Available for freelance work
            </motion.div>

            {/* Name */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-4"
            >
              Hi, I&apos;m{' '}
              <span className="gradient-text">{profile.name}</span>
            </motion.h1>

            {/* Title */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex items-center justify-center lg:justify-start gap-3 mb-6"
              >
                <span className="text-xl sm:text-2xl text-text-secondary font-display font-medium">
                  {profile.title}
                </span>
              </motion.div>
            </motion.div>

            {/* Bio */}
            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <a href="#projects" className="btn-primary">
                <ExternalLink className="w-4 h-4" />
                View Projects
              </a>
              <a href={profile.resumeUrl || '/resume.pdf'} download className="btn-outline">
                <Download className="w-4 h-4" />
                Download Resume
              </a>
              <a href="#contact" className="btn-outline">
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center justify-center lg:justify-start gap-3"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-elevated border border-[#252540] flex items-center justify-center text-text-muted hover:text-primary hover:border-primary hover:shadow-glow-sm transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative flex-shrink-0"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl scale-110" />

            {/* Avatar container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-primary p-[2px]">
                <div className="w-full h-full rounded-full bg-deep flex items-center justify-center overflow-hidden">
                  {/* SVG avatar placeholder — replace with real <Image /> */}
                  <Image
                    src={profile.avatar || '/default-avatar.png'}
                    alt={profile.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-elevated border border-[#252540] rounded-2xl px-3 py-2 shadow-card"
              >
                <div className="text-xs text-text-muted font-mono">React</div>
                <div className="text-sm font-bold text-primary">Next.js</div>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 -left-6 bg-elevated border border-[#252540] rounded-2xl px-3 py-2 shadow-card"
              >
                <div className="text-xs text-text-muted font-mono">Design</div>
                <div className="text-sm font-bold text-accent">Figma</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
