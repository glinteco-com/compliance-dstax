import { betterAuth } from 'better-auth'
import { jwt } from 'better-auth/plugins'
import { Pool } from 'pg'

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [jwt()],
  session: {
    expiresIn: 60 * 60, // 1 hour
    updateAge: 15 * 60, // 15 minutes
  },
})
