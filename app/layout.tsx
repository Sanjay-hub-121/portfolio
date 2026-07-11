import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sanjay — Full Stack Developer & UI/UX Designer',
    template: '%s | Sanjay',
  },
  description:
    'Full Stack Developer and UI/UX Designer based in Tamil Nadu, India. Specializing in modern web applications and premium digital experiences.',
  keywords: ['Full Stack Developer', 'UI/UX Designer', 'React Developer', 'Next.js', 'Tamil Nadu', 'Freelance Developer'],
  authors: [{ name: 'Sanjay' }],
  creator: 'Sanjay',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sanjay.dev',
    title: 'Sanjay — Full Stack Developer & UI/UX Designer',
    description: 'Full Stack Developer and UI/UX Designer based in Tamil Nadu, India. Building modern web applications and premium digital experiences.',
    siteName: 'Sanjay Portfolio',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Sanjay Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanjay — Full Stack Developer & UI/UX Designer',
    description: 'Full Stack Developer and UI/UX Designer based in Tamil Nadu, India.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://sanjay.dev'),
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}