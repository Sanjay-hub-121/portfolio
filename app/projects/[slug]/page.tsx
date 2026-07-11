import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, GitBranch, ExternalLink, Calendar, Tag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

const cardGradients = [
  'from-indigo-500/20 to-violet-500/20',
  'from-violet-500/20 to-fuchsia-500/20',
  'from-blue-500/20 to-indigo-500/20',
]

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: true },
  })

  if (!project) notFound()

  const gradient = cardGradients[project.title.length % cardGradients.length]

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          {/* Header */}
          <div className={`h-52 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden ${project.thumbnail ? '' : `bg-gradient-to-br ${gradient}`}`}>
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="text-6xl font-display font-bold text-white/10">
                {project.title.split(' ').map((w: string) => w[0]).join('').slice(0, 3)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
              {project.category}
            </span>
            {project.featured && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400">
                Featured
              </span>
            )}
            {project.completedAt && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4">
            {project.title}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">{project.shortDescription}</p>

          {/* Links */}
          <div className="flex gap-3 mb-10">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                <GitBranch className="w-4 h-4" />
                Source Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>

          {/* Content sections */}
          <div className="space-y-8">
            <div className="card-glass p-6">
              <h2 className="font-display font-semibold text-text-primary mb-3">Overview</h2>
              <p className="text-text-secondary leading-relaxed">{project.description}</p>
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-text-primary">Technologies Used</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-[#252540] text-text-secondary text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}