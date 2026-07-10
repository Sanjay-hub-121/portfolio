/**
 * Prisma client singleton.
 *
 * IMPORTANT: Before running locally, execute:
 *   npx prisma generate   ← generates the client
 *   npx prisma db push    ← creates tables in Neon
 *   npx ts-node prisma/seed.ts  ← seeds initial data
 *
 * On Vercel, prisma generate runs automatically via vercel.json buildCommand.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: any
}

// We purposely use a dynamic import pattern here so Turbopack
// doesn't try to resolve @prisma/client at build time when the
// generated client doesn't yet exist.
export async function getPrisma() {
  if (!global.__prismaClient) {
    const { PrismaClient } = await import('@prisma/client' as any)
    global.__prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }
  return global.__prismaClient
}

// Synchronous proxy for use in API routes (works after generate)
// API routes are always server-side, never bundled into client JS
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      // Special $ methods return no-ops during static analysis
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return () => Promise.resolve()
      }
      // Return a lazy model accessor
      return new Proxy(
        {},
        {
          get(_t, method: string) {
            return async (...args: any[]) => {
              const client = await getPrisma()
              return client[prop][method](...args)
            }
          },
        }
      )
    },
  }
)
