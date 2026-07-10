import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  behanceUrl: z.string().url().optional().nullable().or(z.literal('')),
  dribbbleUrl: z.string().url().optional().nullable().or(z.literal('')),
  yearsExp: z.number().int().min(0),
  projectsDone: z.number().int().min(0),
  happyClients: z.number().int().min(0),
  techMastered: z.number().int().min(0),
})

export async function GET() {
  const profile = await prisma.profile.findFirst()
  return NextResponse.json(profile)
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const data = profileSchema.parse(body)

    const existing = await prisma.profile.findFirst()
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data })
      : await prisma.profile.create({ data })

    return NextResponse.json(profile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
