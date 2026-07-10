import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  issueDate: z.string(),
  credentialUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export async function GET() {
  const certs = await prisma.certification.findMany({ orderBy: { issueDate: 'desc' } })
  return NextResponse.json(certs)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const cert = await prisma.certification.create({
      data: { ...data, issueDate: new Date(data.issueDate) }
    })
    return NextResponse.json(cert, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
