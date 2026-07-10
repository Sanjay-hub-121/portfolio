import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  // Use webpack (stable) for production builds - Turbopack is dev-only
  // Turbopack doesn't handle conditional requires the same way
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.neon.tech' },
      { protocol: 'https', hostname: 'placehold.co' }, // dev-only placeholder images, remove once real avatars are wired up
    ],
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}
 
export default nextConfig