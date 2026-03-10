import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const res = await auth.api.signInEmail({
      headers: req.headers,
      body: { email, password },
      asResponse: true,
    })

    if (!res.ok) {
      return new Response('Invalid credentials', { status: 401 })
    }

    const data = await res.json()

    // Extract session token from Set-Cookie header for refreshToken
    const setCookie = res.headers.get('set-cookie')
    const sessionTokenMatch = setCookie?.match(
      /better-auth\.session_token=([^;]+)/
    )
    const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : null

    // Add refreshToken to the response data as requested
    const responseData = {
      ...data,
      refreshToken: sessionToken || data.token,
    }

    // Create response with the updated data
    const response = Response.json(responseData)

    // Forward the original Better Auth cookies
    if (setCookie) {
      response.headers.set('set-cookie', setCookie)
    }

    // Proactively set the specific cookies that proxy.ts expects
    const PREFIX = process.env.NEXT_PUBLIC_PREFIX || ''

    // Set 'token' cookie if present in data
    if (data.token) {
      response.headers.append(
        'set-cookie',
        `${PREFIX}token=${data.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      )
    }

    // Set 'refreshToken' cookie (using the session token)
    if (sessionToken) {
      response.headers.append(
        'set-cookie',
        `${PREFIX}refreshToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      )
    }

    // Also forward JWT headers if present (for the jwt plugin)
    const authJwt = res.headers.get('set-auth-jwt')
    if (authJwt) {
      response.headers.set('set-auth-jwt', authJwt)
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
