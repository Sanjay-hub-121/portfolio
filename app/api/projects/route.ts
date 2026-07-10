import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  thumbnail: z.string().default(''),
  githubUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  category: z.string().min(1),
  technologies: z.array(z.string()),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const projects = await prisma.project.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = projectSchema.parse(body)
    const project = await prisma.project.create({ data, include: { images: true } })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
