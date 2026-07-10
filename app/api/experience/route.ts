import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  current: z.boolean().default(false),
})

export async function GET() {
  const experience = await prisma.experience.findMany({ orderBy: { startDate: 'desc' } })
  return NextResponse.json(experience)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const exp = await prisma.experience.create({
      data: { ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null }
    })
    return NextResponse.json(exp, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
