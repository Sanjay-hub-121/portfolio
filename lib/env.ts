/**
 * Environment variable validation.
 * Call this in server-side code to get early, clear errors.
 *
 * Required in production:
 *   DATABASE_URL       - Neon PostgreSQL connection string
 *   NEXTAUTH_SECRET    - Random 32-char string (openssl rand -base64 32)
 *   NEXTAUTH_URL       - Your deployed domain (https://sanjay.dev)
 *
 * Optional:
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / CONTACT_EMAIL  - Email notifications
 *   CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET  - Image uploads
 */

interface EnvConfig {
  databaseUrl: string
  nextAuthSecret: string
  nextAuthUrl: string
  smtp: {
    host: string | undefined
    port: number
    user: string | undefined
    pass: string | undefined
    contactEmail: string | undefined
    configured: boolean
  }
  cloudinary: {
    cloudName: string | undefined
    apiKey: string | undefined
    apiSecret: string | undefined
    configured: boolean
  }
  isDev: boolean
  isProd: boolean
}

function validateEnv(): EnvConfig {
  const missing: string[] = []

  const databaseUrl = process.env.DATABASE_URL
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL

  if (!databaseUrl) missing.push('DATABASE_URL')
  if (!nextAuthSecret) missing.push('NEXTAUTH_SECRET')

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(
      `[Config Error] Missing required environment variables:\n` +
      missing.map((v) => `  • ${v}`).join('\n') +
      `\n\nAdd these in your Vercel project settings or .env.local file.\n` +
      `See .env.example for documentation.`
    )
  }

  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  return {
    databaseUrl: databaseUrl ?? '',
    nextAuthSecret: nextAuthSecret ?? 'dev-secret-not-for-production',
    nextAuthUrl: nextAuthUrl ?? 'http://localhost:3000',
    smtp: {
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      user: smtpUser,
      pass: smtpPass,
      contactEmail: process.env.CONTACT_EMAIL ?? smtpUser,
      configured: Boolean(smtpHost && smtpUser && smtpPass),
    },
    cloudinary: {
      cloudName,
      apiKey,
      apiSecret,
      configured: Boolean(cloudName && apiKey && apiSecret),
    },
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  }
}

// Singleton — only validate once per process
let _env: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!_env) {
    _env = validateEnv()
  }
  return _env
}

// Print config status on startup (dev only)
export function logEnvStatus() {
  if (process.env.NODE_ENV !== 'development') return
  const env = getEnv()
  console.log('\n📋 Portfolio Config Status:')
  console.log(`  Database:   ${env.databaseUrl ? '✅ Connected' : '❌ Not set'}`)
  console.log(`  Auth:       ${env.nextAuthSecret !== 'dev-secret-not-for-production' ? '✅ Configured' : '⚠️  Using dev secret'}`)
  console.log(`  Email:      ${env.smtp.configured ? '✅ Configured' : '⚠️  Not configured (contact form saves to DB only)'}`)
  console.log(`  Cloudinary: ${env.cloudinary.configured ? '✅ Configured' : '⚠️  Not configured (uploads will use placeholder)'}`)
  console.log('')
}
