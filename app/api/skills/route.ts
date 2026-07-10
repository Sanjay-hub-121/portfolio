import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  category: z.string().min(1),
  percentage: z.number().min(0).max(100),
})

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { category: 'asc' } })
  return NextResponse.json(skills)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = skillSchema.parse(body)
    const skill = await prisma.skill.create({ data })
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
