'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { format } from 'date-fns'
import { CommunicationRecord } from '../DraftsTab'

interface UseColumnDraftProps {
  onDelete: (id: number) => void
}

export const useColumnDraft = ({ onDelete }: UseColumnDraftProps) => {
  const columns: Column<CommunicationRecord>[] = [
    {
      id: 'subject',
      label: 'Subject',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.subject || '(No subject)'}
        </span>
      ),
    },
    {
      id: 'updated_at',
      label: 'Last Updated',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {format(new Date(item.updated_at), 'MMM d, yyyy h:mm a')}
        </span>
      ),
    },
    {
      id: 'recipients',
      label: 'Recipients',
      render: (item) => {
        const count = item.recipients?.length || 0
        if (count === 0) return <span className="text-zinc-500">—</span>
        return (
          <span className="text-zinc-700 dark:text-zinc-300">
            {count} recipient{count !== 1 ? 's' : ''}
          </span>
        )
      },
    },
    {
      id: 'actions',
      label: '',
      width: 60,
      align: 'right',
      render: (item) => (
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <CommonTooltip content="Delete">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CommonTooltip>
        </div>
      ),
    },
  ]

  return { columns }
}
