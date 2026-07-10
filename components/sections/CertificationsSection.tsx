'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'

interface Certification {
  id: string
  title: string
  organization: string
  issueDate: string
  credentialUrl: string | null
  imageUrl: string | null
}

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const res = await fetch('/api/certifications')
        const data = await res.json()
        setCertifications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load certifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCertifications()
  }, [])

  if (!loading && certifications.length === 0) return null

  return (
    <section id="certifications" className="section-padding">
      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-4"
        >
          <span className="section-label">Certifications</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-10"
        >
          Licenses & <span className="gradient-text">certifications</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-16 text-text-muted">Loading certifications...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-glass p-5 flex gap-4 hover:border-primary/30 transition-colors duration-300"
              >
                {cert.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.imageUrl}
                    alt={cert.organization}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-text-primary text-sm mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-1">{cert.organization}</p>
                  <p className="text-xs text-text-muted font-mono">
                    {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:gap-1.5 transition-all"
                    >
                      View credential
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && certifications.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <Award className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No certifications added yet.
          </div>
        )}
      </div>
    </section>
  )
}
