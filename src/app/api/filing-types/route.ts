import { FilingType } from '@/types/filing-type'
import { NextRequest, NextResponse } from 'next/server'

const mockData: FilingType[] = [
  {
    id: '1',
    type: 'E-File',
    description: 'Electronic filing via online portal',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    type: 'Mail',
    description: 'Paper filing via postal mail',
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    type: 'In-Person',
    description: 'Filing submitted in person at the office',
    createdAt: '2026-01-15',
  },
  {
    id: '4',
    type: 'Fax',
    description: 'Filing submitted via fax',
    createdAt: '2026-01-15',
  },
  {
    id: '5',
    type: 'EDI',
    description: 'Electronic Data Interchange filing',
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
