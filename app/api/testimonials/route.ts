import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  position: z.string().min(1),
  review: z.string().min(10),
  rating: z.number().int().min(1).max(5).default(5),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
})

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { featured: 'desc' } })
  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const testimonial = await prisma.testimonial.create({ data })
    return NextResponse.json(testimonial, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
