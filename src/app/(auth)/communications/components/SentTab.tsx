'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Mail, Send, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { MOCK_SENT } from '@/lib/mock-data/communications'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileIcon, Paperclip, CalendarIcon, Info } from 'lucide-react'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { useColumnSent } from './hooks/useColumnSent'
import { useApiCoreClientRetrieve } from '@/api/generated/core-client/core-client'
import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'

function ClientNameCell({ clientId }: { clientId: string }) {
  const clientIdNum = Number(clientId)
  const { data: client } = useApiCoreClientRetrieve(clientIdNum, {
    query: { enabled: !isNaN(clientIdNum) },
  })
  return (
    <span className="font-semibold">
      {client?.name || `Client #${clientId}`}
    </span>
  )
}

function LegalEntitiesCell({ legalEntityIds }: { legalEntityIds: string[] }) {
  const { data: entitiesData } = useApiCoreLegalEntityList(
    {
      id__in: legalEntityIds.map(Number),
    },
    {
      query: { enabled: legalEntityIds.length > 0 },
    }
  )

  if (!entitiesData?.results)
    return <span className="text-xs text-zinc-400">Loading...</span>

  const MAX_DISPLAY = 2
  const displayed = entitiesData.results.slice(0, MAX_DISPLAY)
  const remaining = entitiesData.results.length - MAX_DISPLAY

  return (
    <div className="flex flex-col gap-1 py-1">
      {displayed.map((e) => (
        <span key={e.id} className="text-xs font-medium text-zinc-500">
          {e.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-brand-orange-500 text-[10px] font-bold">
          + {remaining} MORE
        </span>
      )}
    </div>
  )
}

const recipientColumns: Column<{
  clientId: string
  legalEntityIds: string[]
}>[] = [
  {
    id: 'client',
    label: 'CLIENT',
    width: 100,
    render: (item) => <ClientNameCell clientId={item.clientId} />,
  },
  {
    id: 'entities',
    label: 'LEGAL ENTITIES',
    render: (item) => (
      <LegalEntitiesCell legalEntityIds={item.legalEntityIds} />
    ),
  },
]

export interface CommunicationRecord {
  id: number
  subject: string
  html_content: string
  created_at: string
  sent_at?: string
  is_draft: boolean
  recipients: { clientId: string; legalEntityIds: string[] }[]
}

function useSentEmails() {
  return useQuery({
    queryKey: ['communications', 'sent'],
    queryFn: async () => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      return {
        results: MOCK_SENT,
        count: MOCK_SENT.length,
        next: null,
        previous: null,
      }
    },
  })
}

export function SentTab() {
  const router = useRouter()
  const { data, isLoading } = useSentEmails()
  const [selectedRecord, setSelectedRecord] =
    useState<CommunicationRecord | null>(null)

  const sent = data?.results ?? []

  const totalLegalEntities = selectedRecord
    ? selectedRecord.recipients.reduce(
        (total, recipient) => total + recipient.legalEntityIds.length,
        0
      )
    : 0

  const { columns } = useColumnSent()

  return (
    <div className="flex min-h-full flex-col pt-4">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      ) : sent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <Send className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">No sent emails yet.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/communications?compose=new')}
          >
            <Mail className="size-4" />
            COMPOSE NEW EMAIL
          </Button>
        </div>
      ) : (
        <CommonTable
          columns={columns}
          data={sent}
          onRowClick={(record) => setSelectedRecord(record)}
        />
      )}

      <Sheet
        open={!!selectedRecord}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null)
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 sm:max-w-lg"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Email Details</SheetTitle>
            <SheetDescription>
              Detailed view of the sent communication.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 dark:bg-zinc-950/50">
            <div className="flex flex-col gap-4">
              {/* BASIC INFO */}
              <Card>
                <CardContent className="grid gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-zinc-500 uppercase">
                      Subject
                    </span>
                    <span className="text-sm font-semibold">
                      {selectedRecord?.subject || '(No subject)'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-zinc-500 uppercase">
                      Sent Date
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="size-3.5 text-zinc-400" />
                      {selectedRecord &&
                        format(
                          new Date(
                            selectedRecord.sent_at || selectedRecord.created_at
                          ),
                          'MMMM d, yyyy h:mm a'
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RECIPIENTS */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    <Users className="size-3.5" />
                    Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Total Recipients</span>
                      <span className="font-semibold">
                        {selectedRecord?.recipients.length} Clients
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Legal Entities</span>
                      <span className="font-semibold">
                        {totalLegalEntities} Total
                      </span>
                    </div>
                    <div className="mt-4">
                      <CommonTable
                        columns={recipientColumns}
                        data={selectedRecord?.recipients || []}
                        className="border-none bg-transparent"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EMAIL CONTENT */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    <Mail className="size-3.5" />
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-sm [&_h2]:mb-1 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: selectedRecord?.html_content ?? '',
                    }}
                  />
                </CardContent>
              </Card>

              {/* ATTACHMENTS */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    <Paperclip className="size-3.5" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-md border border-dashed p-3 text-center">
                      <FileIcon className="mx-auto size-4 text-zinc-400" />
                      <span className="text-xs text-zinc-500">
                        No official attachments found.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
