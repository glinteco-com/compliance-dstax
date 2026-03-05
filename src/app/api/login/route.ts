import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // This is a mock API for demonstration purposes.
    // In a real application, you would verify credentials against a database.
    if (email === 'admin@example.com' && password === 'password123') {
      return NextResponse.json({
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
        token: 'mock-jwt-token-for-admin',
        message: 'Login successful',
      })
    }

    if (email === 'user@example.com' && password === 'password123') {
      return NextResponse.json({
        user: {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
        },
        token: 'mock-jwt-token-for-user',
        message: 'Login successful',
      })
    }

    // Default mock behavior: succeed for any email with 'password123'
    if (password === 'password123') {
      return NextResponse.json({
        user: {
          id: '3',
          name: email.split('@')[0],
          email: email,
          role: 'user',
        },
        token: `mock-token-${Date.now()}`,
        message: 'Login successful',
      })
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint active. Use POST to login.',
  })
}
