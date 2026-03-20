import { TaxType } from '@/types/tax-type'
import { NextRequest, NextResponse } from 'next/server'

const mockData: TaxType[] = [
  {
    id: '1',
    type: 'Sales',
    description: 'General sales tax',
  },
  {
    id: '2',
    type: 'Sellers Use',
    description: 'Use tax collected by sellers',
  },
  {
    id: '3',
    type: "Consumer's Use",
    description: 'Use tax paid by consumers',
  },
  {
    id: '4',
    type: 'Combined',
    description: 'Combined sales and use tax',
  },
  {
    id: '5',
    type: 'CAT',
    description: 'Commercial Activity Tax',
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
