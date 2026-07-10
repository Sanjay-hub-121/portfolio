'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Layout, Users, Code, Play, Pen, Monitor, CheckCircle2 } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  layout: Layout, users: Users, code: Code, play: Play, 'pen-tool': Pen, monitor: Monitor,
}

const services = [
  {
    title: 'UI Design',
    description: 'Pixel-perfect interfaces that balance aesthetics with functionality, creating visually compelling experiences users love.',
    icon: 'layout',
    features: ['Design Systems', 'Component Libraries', 'Brand Identity', 'Visual Hierarchy'],
  },
  {
    title: 'UX Research',
    description: 'Data-driven insights through user research, testing, and analysis to inform design decisions that solve real problems.',
    icon: 'users',
    features: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Competitive Analysis'],
  },
  {
    title: 'Web Development',
    description: 'Full-stack web applications built with modern technologies, optimized for performance, scalability, and maintainability.',
    icon: 'code',
    features: ['React / Next.js', 'Node.js Backend', 'Database Design', 'API Development'],
  },
  {
    title: 'Prototyping',
    description: 'Interactive prototypes that bring your ideas to life for testing and stakeholder presentations before development.',
    icon: 'play',
    features: ['Figma Prototypes', 'Click-through Flows', 'Micro-interactions', 'User Testing'],
  },
  {
    title: 'Wireframing',
    description: 'Structural blueprints that define information architecture and user flows, serving as the foundation for great design.',
    icon: 'pen-tool',
    features: ['Information Architecture', 'User Flows', 'Low-fi Concepts', 'Stakeholder Alignment'],
  },
  {
    title: 'Web Design',
    description: 'End-to-end website design from concept to deployment, combining aesthetics with conversion-focused design principles.',
    icon: 'monitor',
    features: ['Landing Pages', 'Portfolio Sites', 'E-commerce', 'Business Websites'],
  },
]

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="section-padding">
      <div className="container-max" ref={ref}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-label block mb-4"
        >
          Services
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-4"
        >
          What I can{' '}
          <span className="gradient-text">do for you</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="text-text-secondary mb-12 max-w-2xl"
        >
          From initial concept to production deployment — I handle the full stack of digital product development.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Layout
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="card-glass p-6 hover:border-primary/40 transition-all duration-300 group hover:shadow-glow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center p-8 card-glass"
        >
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            Have a project in mind?
          </h3>
          <p className="text-text-muted mb-6">
            Let&apos;s collaborate to build something amazing together.
          </p>
          <a href="#contact" className="btn-primary">
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  )
}
