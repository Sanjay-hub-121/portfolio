// Seed script - run with: npx ts-node prisma/seed.ts
// Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where: { email: 'sanjay@example.com' },
    update: {},
    create: {
      email: 'sanjay@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Profile
  await prisma.profile.deleteMany()
  await prisma.profile.create({
    data: {
      name: 'Sanjay',
      title: 'Full Stack Developer & UI/UX Designer',
      bio: 'I craft digital experiences that are both beautiful and functional. Specializing in modern web development and intuitive design, I bring ideas to life with clean code and thoughtful interfaces.',
      email: 'sanjay@example.com',
      location: 'Tamil Nadu, India',
      avatar: '/avatar.svg', // explicit local fallback — overrides any schema default (was resolving to a placehold.co SVG)
      githubUrl: 'https://github.com/sanjay',
      linkedinUrl: 'https://linkedin.com/in/sanjay',
      behanceUrl: 'https://behance.net/sanjay',
      dribbbleUrl: 'https://dribbble.com/sanjay',
      yearsExp: 2,
      projectsDone: 15,
      happyClients: 10,
      techMastered: 20,
    },
  })

  // Skills
  await prisma.skill.deleteMany()
  const skills = [
    { name: 'Figma', icon: 'figma', category: 'Design Tools', percentage: 90 },
    { name: 'Adobe XD', icon: 'pen-tool', category: 'Design Tools', percentage: 80 },
    { name: 'Framer', icon: 'framer', category: 'Design Tools', percentage: 75 },
    { name: 'UI Design', icon: 'layout', category: 'UI Design', percentage: 88 },
    { name: 'Design Systems', icon: 'grid', category: 'UI Design', percentage: 82 },
    { name: 'Responsive Design', icon: 'smartphone', category: 'UI Design', percentage: 90 },
    { name: 'User Research', icon: 'users', category: 'UX Design', percentage: 78 },
    { name: 'Wireframing', icon: 'edit-3', category: 'UX Design', percentage: 85 },
    { name: 'Prototyping', icon: 'play', category: 'UX Design', percentage: 82 },
    { name: 'React', icon: 'code', category: 'Frontend Development', percentage: 85 },
    { name: 'Next.js', icon: 'zap', category: 'Frontend Development', percentage: 80 },
    { name: 'TypeScript', icon: 'file-code', category: 'Frontend Development', percentage: 78 },
    { name: 'Tailwind CSS', icon: 'wind', category: 'Frontend Development', percentage: 90 },
    { name: 'HTML/CSS', icon: 'globe', category: 'Frontend Development', percentage: 92 },
    { name: 'Node.js', icon: 'server', category: 'Backend Development', percentage: 78 },
    { name: 'Express.js', icon: 'terminal', category: 'Backend Development', percentage: 80 },
    { name: 'Python', icon: 'cpu', category: 'Backend Development', percentage: 70 },
    { name: 'MongoDB', icon: 'database', category: 'Database', percentage: 80 },
    { name: 'PostgreSQL', icon: 'database', category: 'Database', percentage: 72 },
    { name: 'AWS', icon: 'cloud', category: 'Tools', percentage: 65 },
  ]
  await prisma.skill.createMany({ data: skills })

  // Services
  await prisma.service.deleteMany()
  await prisma.service.createMany({
    data: [
      {
        title: 'UI Design',
        description: 'Pixel-perfect interfaces that balance aesthetics with functionality, creating visually compelling experiences users love.',
        icon: 'layout',
        features: ['Design Systems', 'Component Libraries', 'Brand Identity', 'Visual Hierarchy'],
        order: 1,
      },
      {
        title: 'UX Research',
        description: 'Data-driven insights through user research, testing, and analysis to inform design decisions that solve real problems.',
        icon: 'users',
        features: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Competitive Analysis'],
        order: 2,
      },
      {
        title: 'Web Development',
        description: 'Full-stack web applications built with modern technologies, optimized for performance, scalability, and maintainability.',
        icon: 'code',
        features: ['React / Next.js', 'Node.js Backend', 'Database Design', 'API Development'],
        order: 3,
      },
      {
        title: 'Prototyping',
        description: 'Interactive prototypes that bring your ideas to life for testing and stakeholder presentations before development.',
        icon: 'play',
        features: ['Figma Prototypes', 'Click-through Flows', 'Micro-interactions', 'User Testing'],
        order: 4,
      },
      {
        title: 'Wireframing',
        description: 'Structural blueprints that define information architecture and user flows, serving as the foundation for great design.',
        icon: 'pen-tool',
        features: ['Information Architecture', 'User Flows', 'Low-fi Concepts', 'Stakeholder Alignment'],
        order: 5,
      },
      {
        title: 'Web Design',
        description: 'End-to-end website design from concept to deployment, combining aesthetics with conversion-focused design principles.',
        icon: 'monitor',
        features: ['Landing Pages', 'Portfolio Sites', 'E-commerce', 'Business Websites'],
        order: 6,
      },
    ],
  })

  // Experience
  await prisma.experience.deleteMany()
  await prisma.experience.createMany({
    data: [
      {
        company: 'AGT Electronics Limited',
        position: 'UI/UX Design Intern',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-09-30'),
        description: 'Designed and prototyped user interfaces for internal tools and client-facing dashboards. Collaborated with the development team to implement responsive designs and improve user experience across multiple products.',
        technologies: ['Figma', 'Adobe XD', 'HTML', 'CSS'],
        current: false,
      },
      {
        company: 'Freelance',
        position: 'Full Stack Developer & UI/UX Designer',
        startDate: new Date('2023-10-01'),
        endDate: null,
        description: 'Building custom web applications and digital experiences for local businesses and international clients. Specializing in full-stack development with React, Node.js, and modern design tools.',
        technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Figma'],
        current: true,
      },
    ],
  })

  // Education
  await prisma.education.deleteMany()
  await prisma.education.createMany({
    data: [
      {
        institution: 'University in Tamil Nadu',
        degree: 'M.Sc. Computer Science',
        startDate: new Date('2022-06-01'),
        endDate: null,
        description: 'Pursuing advanced studies in computer science with a focus on software engineering, data structures, and modern web technologies. Current aggregate: 86.72%.',
      },
      {
        institution: 'College in Tamil Nadu',
        degree: 'B.Sc. Computer Science',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2022-05-31'),
        description: 'Completed undergraduate studies in computer science with projects in IoT, emergency services systems, and passport registration web platforms. CGPA: 7.11.',
      },
    ],
  })

  // Projects
  await prisma.project.deleteMany()
  await prisma.project.createMany({
    data: [
      {
        title: 'Personal Portfolio Website',
        slug: 'personal-portfolio',
        shortDescription: 'A production-grade full-stack portfolio with admin dashboard, built with Next.js 15 and PostgreSQL.',
        description: 'Designed and developed a comprehensive portfolio platform from scratch. Features include a dynamic admin panel, contact form with email notifications, project management system, and optimized performance with Lighthouse score above 95.',
        thumbnail: '/images/projects/portfolio.jpg',
        featured: true,
        category: 'Web Development',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
        githubUrl: 'https://github.com/sanjay/portfolio',
        liveUrl: 'https://sanjay.dev',
      },
      {
        title: 'Shivaji Trading Academy Platform',
        slug: 'shivaji-trading-academy',
        shortDescription: 'A trading education platform with React Native mobile app, admin panel, and DRM content security.',
        description: 'Full-stack trading education platform featuring a React Native mobile app for students, a React.js web admin panel for teachers, Firebase backend, and DRM content security. Includes tiered pricing, course management, and real-time analytics.',
        thumbnail: '/images/projects/trading-academy.jpg',
        featured: true,
        category: 'Full Stack',
        technologies: ['React Native', 'React.js', 'Firebase', 'Node.js', 'DRM'],
        githubUrl: null,
        liveUrl: null,
      },
      {
        title: 'Tissue Paper Brand Website',
        slug: 'tissue-paper-brand',
        shortDescription: 'Brand showcase website with full-stack admin panel for a tissue paper manufacturer.',
        description: 'Professional brand website with a complete admin panel built using Node.js, Express.js, MongoDB, Cloudinary, and JWT authentication. Features product catalog management, image optimization, and mobile-first responsive design.',
        thumbnail: '/images/projects/tissue-brand.jpg',
        featured: false,
        category: 'Web Development',
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
        githubUrl: null,
        liveUrl: null,
      },
    ],
  })

  console.log('✅ Seed data created successfully')
  console.log('📧 Admin email: sanjay@example.com')
  console.log('🔑 Admin password: Admin@123')
  console.log('⚠️  Change these credentials before production!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())