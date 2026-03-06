import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import { betterAuth } from 'better-auth'

// 1. Manually load environment variables BEFORE anything else or importing modules that use them
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return
    const [key, ...valueParts] = trimmedLine.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
}

// 2. Define auth locally within the script to ensure it uses the freshly loaded process.env
const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
})

async function seed() {
  console.log('🌱 Seeding test user...')

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set. Check your .env.local file.')
    process.exit(1)
  }

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: 'test@dstax.com',
        password: '123456',
        name: 'Test DSTAX',
      },
    })

    console.log('✅ Test user created successfully:', user.user.email)
  } catch (error: any) {
    if (
      error.message?.includes('already exists') ||
      error.code === 'user_already_exists'
    ) {
      console.log('ℹ️  User already exists, skipping creation.')
    } else {
      console.error('❌ Failed to create user:', error)
    }
  } finally {
    process.exit(0)
  }
}

seed()
