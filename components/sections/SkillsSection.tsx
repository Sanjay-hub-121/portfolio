'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Layout, Users, Code, Server, Database, Wrench, Pen,
  Globe, Wind, Cpu, Cloud, Terminal, FileCode, Play, Grid, Smartphone, Edit3
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  layout: Layout, users: Users, code: Code, server: Server,
  database: Database, wrench: Wrench, 'pen-tool': Pen, globe: Globe,
  wind: Wind, cpu: Cpu, cloud: Cloud, terminal: Terminal,
  'file-code': FileCode, play: Play, grid: Grid, smartphone: Smartphone,
  'edit-3': Edit3, figma: Pen, framer: Play, zap: Code,
}

interface Skill {
  id: string
  name: string
  icon: string
  category: string
  percentage: number
}

function SkillCard({ name, icon, percentage, delay }: { name: string; icon: string; percentage: number; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const Icon = iconMap[icon] || Code

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="card-glass p-5 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-primary truncate">{name}</div>
          <div className="text-xs text-text-muted">{percentage}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-primary rounded-full"
        />
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await fetch('/api/skills')
        const data = await res.json()
        setSkills(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load skills:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [])

  // Categories are derived from whatever categories actually exist in your data,
  // so a new category you add in the admin panel shows up automatically.
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory)

  return (
    <section id="skills" className="section-padding">
      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-4"
        >
          <span className="section-label">Skills</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-8"
        >
          Tools & technologies I{' '}
          <span className="gradient-text">work with</span>
        </motion.h2>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-elevated border border-[#252540] text-text-secondary hover:border-primary/50 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        {loading ? (
          <div className="text-center py-16 text-text-muted">Loading skills...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            {skills.length === 0 ? 'No skills added yet.' : 'No skills in this category.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((skill, i) => (
              <SkillCard key={skill.id} {...skill} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
