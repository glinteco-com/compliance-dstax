import { Jurisdiction } from '@/types/jurisdictions'
import { NextRequest, NextResponse } from 'next/server'

const mockData: Jurisdiction[] = [
  {
    id: '1',
    name: 'Alabama',
    level: 'State',
    dueDate: '2026-04-20',
    dueDateTime: '17:00',
  },
  {
    id: '2',
    name: 'California',
    level: 'State',
    dueDate: '2026-04-30',
    dueDateTime: '23:59',
  },
  {
    id: '3',
    name: 'United States',
    level: 'Country',
    dueDate: '2026-04-15',
    dueDateTime: '12:00',
  },
  {
    id: '4',
    name: 'Los Angeles',
    level: 'Local',
    dueDate: '2026-05-10',
    dueDateTime: '18:00',
  },
  {
    id: '5',
    name: 'Texas',
    level: 'State',
    dueDate: '2026-05-20',
    dueDateTime: '17:00',
  },
  {
    id: '6',
    name: 'New York',
    level: 'State',
    dueDate: '2026-05-30',
    dueDateTime: '23:59',
  },
  {
    id: '7',
    name: 'Chicago',
    level: 'Local',
    dueDate: '2026-06-15',
    dueDateTime: '16:00',
  },
  {
    id: '8',
    name: 'Canada',
    level: 'Country',
    dueDate: '2026-06-30',
    dueDateTime: '23:59',
  },
  {
    id: '9',
    name: 'Florida',
    level: 'State',
    dueDate: '2026-07-20',
    dueDateTime: '17:00',
  },
  {
    id: '10',
    name: 'Seattle',
    level: 'Local',
    dueDate: '2026-07-31',
    dueDateTime: '23:59',
  },
  {
    id: '11',
    name: 'Georgia',
    level: 'State',
    dueDate: '2026-08-20',
    dueDateTime: '17:00',
  },
  {
    id: '12',
    name: 'Ohio',
    level: 'State',
    dueDate: '2026-08-30',
    dueDateTime: '23:59',
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
          item.level.toLowerCase().includes(search)
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
