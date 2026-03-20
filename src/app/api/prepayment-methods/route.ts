import { PrepaymentMethod } from '@/types/prepayment-method'
import { NextRequest, NextResponse } from 'next/server'

const mockData: PrepaymentMethod[] = [
  {
    id: '1',
    state: 'FL',
    method: 'Fixed',
  },
  {
    id: '2',
    state: 'OK',
    method: '50% of same month prior year',
  },
  {
    id: '3',
    state: 'OH',
    method: '75% of current month',
  },
  {
    id: '4',
    state: 'NY',
    method: 'PromptTax',
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
          item.state.toLowerCase().includes(search) ||
          item.method.toLowerCase().includes(search)
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
