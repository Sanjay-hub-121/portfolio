import type { Metadata, Viewport } from 'next'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
