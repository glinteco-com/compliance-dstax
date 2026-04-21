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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isDraft = searchParams.get('is_draft')

  await new Promise((resolve) => setTimeout(resolve, 800))

  if (isDraft === 'true') {
    return NextResponse.json({
      results: globalThis.__mock_drafts,
      count: globalThis.__mock_drafts?.length || 0,
      next: null,
      previous: null,
    })
  }

  if (isDraft === 'false') {
    return NextResponse.json({
      results: globalThis.__mock_sent,
      count: globalThis.__mock_sent?.length || 0,
      next: null,
      previous: null,
    })
  }

  const all = [
    ...(globalThis.__mock_drafts || []),
    ...(globalThis.__mock_sent || []),
  ]
  return NextResponse.json({
    results: all,
    count: all.length,
    next: null,
    previous: null,
  })
}

export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const body = await request.json()
  const newRecord: CommunicationRecord = {
    id: Math.floor(Math.random() * 10000),
    subject: body.subject,
    html_content: body.html_content || body.htmlContent || '',
    recipients: body.recipients || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sent_at: body.is_draft ? undefined : new Date().toISOString(),
    is_draft: !!body.is_draft,
  }

  if (newRecord.is_draft) {
    globalThis.__mock_drafts?.push(newRecord)
  } else {
    globalThis.__mock_sent?.push(newRecord)
  }

  return NextResponse.json(newRecord, { status: 201 })
}
