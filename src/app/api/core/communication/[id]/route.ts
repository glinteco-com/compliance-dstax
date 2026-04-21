import { NextResponse } from 'next/server'
import {
  MOCK_DRAFTS,
  MOCK_SENT,
  CommunicationRecord,
} from '@/lib/mock-data/communications'

declare global {
  var __mock_drafts: CommunicationRecord[] | undefined
  var __mock_sent: CommunicationRecord[] | undefined
}

if (!globalThis.__mock_drafts) {
  globalThis.__mock_drafts = [...MOCK_DRAFTS]
}
if (!globalThis.__mock_sent) {
  globalThis.__mock_sent = [...MOCK_SENT]
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const idNum = Number((await params).id)

  if (globalThis.__mock_drafts) {
    globalThis.__mock_drafts = globalThis.__mock_drafts.filter(
      (d) => d.id !== idNum
    )
  }
  if (globalThis.__mock_sent) {
    globalThis.__mock_sent = globalThis.__mock_sent.filter(
      (s) => s.id !== idNum
    )
  }

  return new NextResponse(null, { status: 204 })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const idNum = Number((await params).id)
  const body = await request.json()

  let updatedRecord = null

  if (globalThis.__mock_drafts) {
    const idx = globalThis.__mock_drafts.findIndex((d) => d.id === idNum)
    if (idx !== -1) {
      globalThis.__mock_drafts[idx] = {
        ...globalThis.__mock_drafts[idx],
        ...body,
        updated_at: new Date().toISOString(),
      }
      updatedRecord = globalThis.__mock_drafts[idx]
    }
  }

  if (globalThis.__mock_sent && !updatedRecord) {
    const idx = globalThis.__mock_sent.findIndex((s) => s.id === idNum)
    if (idx !== -1) {
      globalThis.__mock_sent[idx] = {
        ...globalThis.__mock_sent[idx],
        ...body,
        updated_at: new Date().toISOString(),
      }
      updatedRecord = globalThis.__mock_sent[idx]
    }
  }

  if (!updatedRecord) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(updatedRecord)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const idNum = Number((await params).id)
  const record =
    globalThis.__mock_drafts?.find((d) => d.id === idNum) ||
    globalThis.__mock_sent?.find((s) => s.id === idNum)

  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(record)
}
