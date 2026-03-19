import { User } from '@/types/user'
import { NextRequest, NextResponse } from 'next/server'

const mockData: User[] = [
  {
    id: '1',
    clientName: 'Global Tech Corp',
    name: 'Emily Smith',
    username: 'esmith',
    password: '••••••••',
    role: 'Admin',
  },
  {
    id: '2',
    clientName: 'Global Tech Corp',
    name: 'Josh Miller',
    username: 'jmiller',
    password: '••••••••',
    role: 'Viewer',
  },
  {
    id: '3',
    clientName: 'Eco Solutions Ltd',
    name: 'Sarah Lee',
    username: 'slee',
    password: '••••••••',
    role: 'Editor',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.max(1, Number(searchParams.get('page_size') ?? 10))
  const search = searchParams.get('search')?.toLowerCase() ?? ''

  const filtered = search
    ? mockData.filter(
        (item) =>
          item.clientName.toLowerCase().includes(search) ||
          item.name.toLowerCase().includes(search) ||
          item.username.toLowerCase().includes(search) ||
          item.role.toLowerCase().includes(search)
      )
    : mockData

  const count = filtered.length
  const totalPages = Math.ceil(count / pageSize)
  const results = filtered.slice((page - 1) * pageSize, page * pageSize)

  const buildUrl = (p: number) => {
    const url = new URL(request.url)
    url.searchParams.set('page', String(p))
    url.searchParams.set('page_size', String(pageSize))
    if (search) url.searchParams.set('search', search)
    return url.toString()
  }

  return NextResponse.json({
    count,
    next: page < totalPages ? buildUrl(page + 1) : null,
    previous: page > 1 ? buildUrl(page - 1) : null,
    page_size: pageSize,
    results,
  })
}
