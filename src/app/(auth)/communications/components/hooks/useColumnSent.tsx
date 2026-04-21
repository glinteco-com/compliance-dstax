'use client'

import { Column } from '@/components/table/CommonTable'
import { format } from 'date-fns'
import { CommunicationRecord } from '../SentTab'

export const useColumnSent = () => {
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
      id: 'sent_at',
      label: 'Sent at',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {format(
            new Date(item.sent_at || item.created_at),
            'MMM d, yyyy h:mm a'
          )}
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
  ]

  return { columns }
}
