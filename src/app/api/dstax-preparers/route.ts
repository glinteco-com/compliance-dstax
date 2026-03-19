import { Preparer } from '@/types/dstax-preparer'
import { NextRequest, NextResponse } from 'next/server'

const mockData: Preparer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@dstax.com',
    assignedClients: 5,
  },
  {
    id: '2',
    name: 'Bob Richards',
    email: 'bob.r@dstax.com',
    assignedClients: 3,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie.d@dstax.com',
    assignedClients: 8,
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
          item.name.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search)
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
