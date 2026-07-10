import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export async function GET() {
  const education = await prisma.education.findMany({ orderBy: { startDate: 'desc' } })
  return NextResponse.json(education)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const edu = await prisma.education.create({
      data: { ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null }
    })
    return NextResponse.json(edu, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
