import { prisma } from '@/lib/prisma'

export async function getProfile() {
  const profile = await prisma.profile.findFirst()
  return profile
}