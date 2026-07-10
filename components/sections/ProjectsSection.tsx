'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { GitBranch, ExternalLink, Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  thumbnail: string
  featured: boolean
  category: string
  technologies: string[]
  githubUrl: string | null
  liveUrl: string | null
}

// Gradient colors used as a fallback background if a project has no thumbnail yet
const cardGradients = [
  'from-indigo-500/20 to-violet-500/20',
  'from-violet-500/20 to-fuchsia-500/20',
  'from-blue-500/20 to-indigo-500/20',
]

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Categories are derived from whatever categories actually exist in your data,
  // so a new category you add in the admin panel shows up automatically.
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <section id="projects" className="section-padding bg-deep">
      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-4"
        >
          <span className="section-label">Projects</span>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-bold"
          >
            Selected <span className="gradient-text">work</span>
          </motion.h2>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-elevated border border-[#252540] rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors w-52"
            />
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-elevated border border-[#252540] text-text-secondary hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-text-muted">Loading projects...</div>
        ) : (
          <>
            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-glass overflow-hidden hover:border-primary/30 transition-all duration-300 group flex flex-col"
                  >
                    {/* Thumbnail (real image if present, gradient + initials fallback otherwise) */}
                    <div className={`h-44 relative overflow-hidden ${project.thumbnail ? '' : `bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}`}>
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-display font-bold text-white/10">
                            {project.title.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                          </div>
                        </div>
                      )}
                      {project.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-primary/90 text-white text-xs font-medium">
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {project.category}
                        </span>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-text-primary transition-colors"
                              aria-label="GitHub"
                            >
                              <GitBranch className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-text-primary transition-colors"
                              aria-label="Live demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="font-display font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                        {project.shortDescription}
                      </p>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-0.5 rounded-md bg-surface border border-[#252540] text-text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-surface border border-[#252540] text-text-muted">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all duration-200 font-medium"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                {projects.length === 0
                  ? 'No projects added yet.'
                  : 'No projects match your search. Try a different filter.'}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
