import type { NextAuthConfig } from 'next-auth'

// Edge-safe config: no providers, no bcrypt, no zod. Middleware imports this
// (via auth.ts's `authConfig` re-export pattern) so its Edge Function bundle
// stays small. The full config with the Credentials provider lives in auth.ts,
// which only ever runs in the Node.js runtime (API routes), where bundle size
// isn't restricted.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { id?: string; email?: string | null; role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as typeof session.user & { role: string }).role = token.role as string
      }
      return session
    },
  },
  providers: [], // populated in auth.ts, not here
}
