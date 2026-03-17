import { NextResponse } from 'next/server'

export async function POST() {
  const PREFIX = process.env.NEXT_PUBLIC_PREFIX || ''
  const response = NextResponse.json({ success: true })

  // Clear the custom cookies
  response.cookies.set(`${PREFIX}token`, '', {
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(`${PREFIX}refreshToken`, '', {
    path: '/',
    maxAge: 0,
  })

  // Clear better-auth session token just in case
  response.cookies.set('better-auth.session_token', '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
