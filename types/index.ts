export interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail: string
  githubUrl?: string | null
  liveUrl?: string | null
  featured: boolean
  category: string
  technologies: string[]
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  images: ProjectImage[]
}

export interface ProjectImage {
  id: string
  projectId: string
  imageUrl: string
}

export interface Skill {
  id: string
  name: string
  icon: string
  category: string
  percentage: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  order: number
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate?: Date | null
  description: string
  technologies: string[]
  current: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  startDate: Date
  endDate?: Date | null
  description?: string | null
}

export interface Certification {
  id: string
  title: string
  organization: string
  issueDate: Date
  credentialUrl?: string | null
  imageUrl?: string | null
}

export interface Testimonial {
  id: string
  name: string
  company: string
  position: string
  review: string
  rating: number
  imageUrl?: string | null
  featured: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone?: string | null
  location?: string | null
  avatar?: string | null
  resumeUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  behanceUrl?: string | null
  dribbbleUrl?: string | null
  yearsExp: number
  projectsDone: number
  happyClients: number
  techMastered: number
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export type SkillCategory =
  | 'UI Design'
  | 'UX Design'
  | 'Frontend Development'
  | 'Backend Development'
  | 'Database'
  | 'Tools'
  | 'Design Tools'
