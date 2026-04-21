'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { FileText, Loader2, Mail, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_DRAFTS } from '@/lib/mock-data/communications'
import apiClient from '@/api/api-client'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import useDialog from '@/hooks/useDialog'
import { CommonTable } from '@/components/table/CommonTable'
import { useColumnDraft } from './hooks/useColumnDraft'

export interface CommunicationRecord {
  id: number
  subject: string
  html_content: string
  created_at: string
  updated_at: string
  is_draft: boolean
  recipients: { clientId: string; legalEntityIds: string[] }[]
}

function useDrafts() {
  return useQuery({
    queryKey: ['communications', 'drafts'],
    queryFn: async () => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      return {
        results: MOCK_DRAFTS,
        count: MOCK_DRAFTS.length,
        next: null,
        previous: null,
      }
    },
  })
}

export function DraftsTab() {
  const router = useRouter()
  const { data, isLoading, refetch } = useDrafts()
  const [targetId, setTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { isOpenDialog, onOpenDialog, onCloseDialog } = useDialog()

  const handleDeleteClick = (id: number) => {
    setTargetId(id)
    onOpenDialog()
  }

  const { columns } = useColumnDraft({ onDelete: handleDeleteClick })

  const handleConfirmDelete = async () => {
    if (!targetId) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/api/core/communication/${targetId}/`)
      toast.success('Draft deleted')
      refetch()
      onCloseDialog()
    } catch {
      toast.error('Failed to delete draft')
    } finally {
      setIsDeleting(false)
      setTargetId(null)
    }
  }

  const drafts = data?.results ?? []

  return (
    <div className="flex min-h-full flex-col pt-4">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <FileText className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">No drafts saved yet.</p>
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
          data={drafts}
          onRowClick={(draft) =>
            router.push(`/communications?draftId=${draft.id}`)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isOpenDialog}
        onOpenChange={(open) => {
          if (!open) onCloseDialog()
        }}
        title="Delete Draft"
        description="Are you sure you want to delete this draft? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
