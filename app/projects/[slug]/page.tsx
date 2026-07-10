import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GitBranch, ExternalLink, Calendar, Tag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const projects = [
  {
    slug: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    shortDescription: 'Production-grade full-stack portfolio with admin dashboard.',
    description: 'A comprehensive portfolio platform built from scratch with Next.js 15, featuring a dynamic admin panel, contact form with email notifications, project management system, and optimized performance. The design uses Space Grotesk for display text with a deep space color palette and indigo-violet accent gradient.',
    category: 'Web Development',
    technologies: ['Next.js 15', 'TypeScript', 'Prisma ORM', 'PostgreSQL (Neon)', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    githubUrl: 'https://github.com/sanjay/portfolio',
    liveUrl: 'https://sanjay.dev',
    featured: true,
    completedAt: '2024-01',
    problem: 'Needed a professional portfolio that goes beyond a simple static website — something that works as a full product with content management, contact form handling, and a clean admin interface.',
    solution: 'Built a Next.js 15 app with App Router, PostgreSQL via Prisma, and a complete admin dashboard. Used server components for performance and Framer Motion for polished animations.',
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    slug: 'shivaji-trading-academy',
    title: 'Shivaji Trading Academy',
    shortDescription: 'Trading education platform with React Native mobile app and DRM security.',
    description: 'A full-stack trading education platform featuring a React Native mobile app for students, a React.js admin panel for teachers, Firebase backend, and DRM content security to protect course materials.',
    category: 'Full Stack',
    technologies: ['React Native', 'React.js', 'Firebase', 'Node.js', 'Figma', 'DRM'],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    completedAt: '2024-03',
    problem: 'A trading academy needed a digital platform to deliver protected video content to paid students, with a teacher admin panel for managing courses and tracking progress.',
    solution: 'Designed 13 Figma screens (dark theme, gold accents) and architected a full-stack solution with Firebase for auth and storage, React Native for the student app, and a React.js admin panel.',
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
  },
  {
    slug: 'tissue-paper-brand',
    title: 'Tissue Paper Brand Website',
    shortDescription: 'Brand showcase with full-stack admin panel for product management.',
    description: 'Professional brand website with complete admin panel for a tissue paper manufacturer. Features product catalog management, Cloudinary image optimization, JWT authentication, and mobile-first responsive design.',
    category: 'Web Development',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT', 'HTML/CSS'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    completedAt: '2023-12',
    problem: 'A local tissue paper manufacturer needed a professional online presence with the ability to manage their product catalog without technical knowledge.',
    solution: 'Built a clean brand showcase website with a secure admin panel. Product images are stored on Cloudinary with automatic optimization. JWT auth protects the admin routes.',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
]

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

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
          <div className={`h-52 rounded-2xl bg-gradient-to-br ${project.gradient} mb-8 flex items-center justify-center relative overflow-hidden`}>
            <div className="text-6xl font-display font-bold text-white/10">
              {project.title.split(' ').map(w => w[0]).join('').slice(0, 3)}
            </div>
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
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              {project.completedAt}
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card-glass p-6">
                <h2 className="font-display font-semibold text-text-primary mb-3">The Problem</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{project.problem}</p>
              </div>
              <div className="card-glass p-6">
                <h2 className="font-display font-semibold text-text-primary mb-3">The Solution</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{project.solution}</p>
              </div>
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-text-primary">Technologies Used</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
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
