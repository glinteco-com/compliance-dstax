import { LegalEntity } from '@/types/legal-entity'
import { NextRequest, NextResponse } from 'next/server'

const mockData: LegalEntity[] = [
  {
    id: '1',
    clientName: 'Global Tech Corp',
    entityName: 'Genesis Maintenance Corporation',
    entityType: 'Corporation',
    fein: '12-3456781',
    state: 'Delaware',
  },
  {
    id: '2',
    clientName: 'Global Tech Corp',
    entityName: 'Access Direct Systems Inc',
    entityType: 'Corporation',
    fein: '12-3456782',
    state: 'New York',
  },
  {
    id: '3',
    clientName: 'Global Tech Corp',
    entityName: 'Allwork',
    entityType: 'LLC',
    fein: '12-3456783',
    state: 'California',
  },
  {
    id: '4',
    clientName: 'Global Tech Corp',
    entityName: 'Best Press',
    entityType: 'Corporation',
    fein: '12-3456784',
    state: 'Texas',
  },
  {
    id: '5',
    clientName: 'Global Tech Corp',
    entityName: 'Ussery Printing',
    entityType: 'Corporation',
    fein: '12-3456785',
    state: 'Texas',
  },
  {
    id: '6',
    clientName: 'Global Tech Corp',
    entityName: 'Blanks Printing & Imaging, Inc.',
    entityType: 'Corporation',
    fein: '12-3456786',
    state: 'Texas',
  },
  {
    id: '7',
    clientName: 'Global Tech Corp',
    entityName: 'Blevins, Inc.',
    entityType: 'Corporation',
    fein: '12-3456787',
    state: 'Tennessee',
  },
  {
    id: '8',
    clientName: 'Global Tech Corp',
    entityName: 'Carahsoft Technology',
    entityType: 'Corporation',
    fein: '12-3456788',
    state: 'Virginia',
  },
  {
    id: '9',
    clientName: 'Global Tech Corp',
    entityName: 'FedResults, Inc.',
    entityType: 'Corporation',
    fein: '12-3456789',
    state: 'Virginia',
  },
  {
    id: '10',
    clientName: 'Global Tech Corp',
    entityName: 'Carton Craft Supply',
    entityType: 'LLC',
    fein: '12-3456790',
    state: 'Illinois',
  },
  {
    id: '11',
    clientName: 'Global Tech Corp',
    entityName: 'Serviform America',
    entityType: 'LLC',
    fein: '12-3456791',
    state: 'Georgia',
  },
  {
    id: '12',
    clientName: 'Global Tech Corp',
    entityName: 'Cutlite Penta America, LLC',
    entityType: 'LLC',
    fein: '12-3456792',
    state: 'Georgia',
  },
  {
    id: '13',
    clientName: 'Global Tech Corp',
    entityName: 'CleanConnect AI',
    entityType: 'Corporation',
    fein: '12-3456793',
    state: 'Florida',
  },
  {
    id: '14',
    clientName: 'Global Tech Corp',
    entityName: 'Digital Room LLC',
    entityType: 'LLC',
    fein: '12-3456794',
    state: 'California',
  },
  {
    id: '15',
    clientName: 'Global Tech Corp',
    entityName: 'Direct Marketing Solutions',
    entityType: 'Corporation',
    fein: '12-3456795',
    state: 'Oregon',
  },
  {
    id: '16',
    clientName: 'Global Tech Corp',
    entityName: 'Dynamic Brands LLC',
    entityType: 'LLC',
    fein: '12-3456796',
    state: 'South Carolina',
  },
  {
    id: '17',
    clientName: 'Global Tech Corp',
    entityName: 'Dynamic Motion LLC',
    entityType: 'LLC',
    fein: '12-3456797',
    state: 'North Carolina',
  },
  {
    id: '18',
    clientName: 'Global Tech Corp',
    entityName: 'Simpler Postage dba EasyPost',
    entityType: 'Corporation',
    fein: '12-3456798',
    state: 'Utah',
  },
  {
    id: '19',
    clientName: 'Global Tech Corp',
    entityName: 'Echelon Fitness',
    entityType: 'Corporation',
    fein: '12-3456799',
    state: 'Tennessee',
  },
  {
    id: '20',
    clientName: 'Global Tech Corp',
    entityName: 'Echelon Holdings',
    entityType: 'Corporation',
    fein: '12-3456800',
    state: 'Tennessee',
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
          item.entityName.toLowerCase().includes(search) ||
          item.entityType.toLowerCase().includes(search) ||
          item.fein.toLowerCase().includes(search) ||
          item.state.toLowerCase().includes(search)
      )
    : mockData

  const count = filtered.length
  const totalPages = Math.ceil(count / pageSize)
  const startIndex = (page - 1) * pageSize
  const results = filtered.slice(startIndex, startIndex + pageSize)

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
