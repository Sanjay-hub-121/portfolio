'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react'

const experiences = [
  {
    type: 'work',
    company: 'Freelance',
    position: 'Full Stack Developer & UI/UX Designer',
    period: 'Oct 2023 — Present',
    current: true,
    location: 'Tamil Nadu, India (Remote)',
    description:
      'Building custom web applications and digital experiences for local businesses and international clients. Delivering full-stack solutions with React, Node.js, and modern design tools. Managing end-to-end project lifecycle from design to deployment.',
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Figma', 'Tailwind CSS'],
  },
  {
    type: 'work',
    company: 'AGT Electronics Limited',
    position: 'UI/UX Design Intern',
    period: 'Jun 2023 — Sep 2023',
    current: false,
    location: 'Tamil Nadu, India',
    description:
      'Designed and prototyped user interfaces for internal tools and client-facing dashboards. Collaborated with developers to implement responsive designs. Contributed to improving UX across multiple product lines, conducting usability reviews and delivering high-fidelity Figma mockups.',
    technologies: ['Figma', 'Adobe XD', 'HTML', 'CSS', 'Prototyping'],
  },
]

const education = [
  {
    type: 'education',
    institution: 'University in Tamil Nadu',
    degree: 'M.Sc. Computer Science',
    period: 'Jun 2022 — Present',
    current: true,
    description: 'Advanced studies in software engineering, data structures, algorithms, and modern web technologies. Current aggregate: 86.72%.',
  },
  {
    type: 'education',
    institution: 'College in Tamil Nadu',
    degree: 'B.Sc. Computer Science',
    period: 'Jun 2019 — May 2022',
    current: false,
    description: 'Undergraduate degree with projects in IoT systems, emergency services web apps, and passport registration platforms. CGPA: 7.11.',
  },
]

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="section-padding bg-deep">
      <div className="container-max" ref={ref}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-label block mb-4"
        >
          Experience
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-12"
        >
          My <span className="gradient-text">journey</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display font-semibold text-text-primary">Work Experience</h3>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent" />

              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="relative pl-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-elevated border-2 border-primary flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${exp.current ? 'bg-primary animate-pulse' : 'bg-text-muted'}`} />
                    </div>

                    <div className="card-glass p-5 hover:border-primary/30 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-display font-semibold text-text-primary">{exp.position}</h4>
                          <div className="text-primary font-medium text-sm">{exp.company}</div>
                        </div>
                        {exp.current && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{exp.location}
                        </span>
                      </div>

                      <p className="text-text-muted text-sm leading-relaxed mb-3">{exp.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-display font-semibold text-text-primary">Education</h3>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 to-transparent" />

              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-elevated border-2 border-accent flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${edu.current ? 'bg-accent animate-pulse' : 'bg-text-muted'}`} />
                    </div>

                    <div className="card-glass p-5 hover:border-accent/30 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-display font-semibold text-text-primary">{edu.degree}</h4>
                          <div className="text-accent font-medium text-sm">{edu.institution}</div>
                        </div>
                        {edu.current && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            Pursuing
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted mb-3">
                        <Calendar className="w-3 h-3" />{edu.period}
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed">{edu.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
