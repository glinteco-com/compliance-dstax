import { FilingFrequency } from '@/types/filing-frequency'
import { NextRequest, NextResponse } from 'next/server'

const mockData: FilingFrequency[] = [
  {
    id: '1',
    type: 'M',
    description: 'Monthly',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    type: 'W',
    description: 'Weekly',
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    type: 'Q',
    description: 'Quarterly',
    createdAt: '2026-01-15',
  },
  {
    id: '4',
    type: 'A',
    description: 'Annual',
    createdAt: '2026-01-15',
  },
  {
    id: '5',
    type: 'SA',
    description: 'Semi-Annual',
    createdAt: '2026-02-01',
  },
  {
    id: '6',
    type: 'D',
    description: 'Daily',
    createdAt: '2026-02-01',
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
          item.type.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
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
