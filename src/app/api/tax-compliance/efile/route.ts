import { NextRequest, NextResponse } from 'next/server'
import { listEfileRecords, createEfileRecord } from './_store'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') ?? undefined
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('page_size') ?? '10')
  return NextResponse.json(listEfileRecords(search, page, pageSize))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const record = createEfileRecord(body)
  return NextResponse.json(record, { status: 201 })
}
