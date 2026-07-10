'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Briefcase, GraduationCap, Coffee } from 'lucide-react'

const stats = [
  { label: 'Years Experience', value: '2+', icon: Briefcase },
  { label: 'Projects Completed', value: '15+', icon: Coffee },
  { label: 'Happy Clients', value: '10+', icon: GraduationCap },
  { label: 'Technologies', value: '20+', icon: MapPin },
]

const highlights = [
  { label: 'Location', value: 'Tamil Nadu, India', icon: MapPin },
  { label: 'Education', value: 'M.Sc. Computer Science', icon: GraduationCap },
  { label: 'Experience', value: 'UI/UX Intern @ AGT Electronics', icon: Briefcase },
  { label: 'Focus', value: 'Full Stack + Design', icon: Coffee },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="section-padding bg-deep">
      <div className="container-max" ref={ref}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="section-label">About Me</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Turning ideas into{' '}
              <span className="gradient-text">elegant solutions</span>
            </h2>

            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I&apos;m a Full Stack Developer and UI/UX Designer currently pursuing my M.Sc. in Computer Science 
                in Tamil Nadu. With a strong foundation in both design and engineering, I bridge the gap 
                between beautiful interfaces and robust functionality.
              </p>
              <p>
                My journey started with a UI/UX internship at AGT Electronics Limited, where I designed 
                interfaces for internal tools and client dashboards. Since then, I&apos;ve been building 
                freelance projects for local businesses and international clients on platforms like Fiverr 
                and Upwork.
              </p>
              <p>
                I believe great products are built at the intersection of thoughtful design and clean code. 
                Every project I take on gets the same level of care — from pixel-perfect UI to 
                production-ready backend architecture.
              </p>
            </div>

            {/* Quick info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-[#252540]"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">{label}</div>
                    <div className="text-sm text-text-primary font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ label, value, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="card-glass p-6 hover:border-primary/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-display font-bold gradient-text mb-1">{value}</div>
                  <div className="text-sm text-text-muted">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Currently learning */}
            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="glow-dot" />
                <span className="text-sm font-mono text-text-muted">Currently working on</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Shivaji Trading Academy App', tech: 'React Native + Firebase' },
                  { name: 'Portfolio v2', tech: 'Next.js 15 + PostgreSQL' },
                  { name: 'Digital Marketing Services', tech: 'SEO + Social Media' },
                ].map(({ name, tech }) => (
                  <div key={name} className="flex items-start justify-between gap-4">
                    <span className="text-text-primary text-sm font-medium">{name}</span>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg whitespace-nowrap">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
