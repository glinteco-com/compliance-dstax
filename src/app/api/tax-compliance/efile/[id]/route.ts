import { NextRequest, NextResponse } from 'next/server'
import { updateEfileRecord, deleteEfileRecord } from '../_store'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const record = updateEfileRecord(Number(id), body)
  if (!record) {
    return NextResponse.json({ detail: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(record)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ok = deleteEfileRecord(Number(id))
  if (!ok) {
    return NextResponse.json({ detail: 'Not found' }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
