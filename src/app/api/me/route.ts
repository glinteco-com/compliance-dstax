import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  // You must pass the headers (which contain the session cookie)
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  return Response.json(session.user)
}
