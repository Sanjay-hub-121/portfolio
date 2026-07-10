'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote, Users } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  company: string
  position: string
  review: string
  rating: number
  imageUrl: string | null
  featured: boolean
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        setTestimonials(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  // Nothing to show and nothing loading — skip rendering the section entirely
  // rather than showing an empty block on the live site.
  if (!loading && testimonials.length === 0) return null

  return (
    <section id="testimonials" className="section-padding bg-deep">
      <div className="container-max" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-4"
        >
          <span className="section-label">Testimonials</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-10"
        >
          What clients <span className="gradient-text">say</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-16 text-text-muted">Loading testimonials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`card-glass p-6 flex flex-col ${t.featured ? 'border-primary/40' : ''}`}
              >
                <Quote className="w-6 h-6 text-primary/40 mb-3" />

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4"
                      style={{
                        color: idx < t.rating ? '#fbbf24' : '#252540',
                        fill: idx < t.rating ? '#fbbf24' : 'transparent',
                      }}
                    />
                  ))}
                </div>

                <p className="text-text-secondary text-sm leading-relaxed italic flex-1 mb-5">
                  &ldquo;{t.review}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#252540]">
                  {t.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-primary">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-primary">{t.name}</div>
                    <div className="text-xs text-text-muted">
                      {t.position} @ {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No testimonials yet.
          </div>
        )}
      </div>
    </section>
  )
}
