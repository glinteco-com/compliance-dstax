'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { FilingFrequency } from '@/models/filingFrequency'

interface UseColumnFilingFrequencyProps {
  onDelete: (id: string) => void
}

export const useColumnFilingFrequency = ({
  onDelete,
}: UseColumnFilingFrequencyProps) => {
  const columns: Column<FilingFrequency>[] = [
    {
      id: 'id',
      label: 'ID',
      width: 100,
      render: (item) => (
        <span className="font-mono text-xs text-zinc-500">{item.id}</span>
      ),
    },
    {
      id: 'code',
      label: 'Code',
      render: (item) => (
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {item.code}
        </span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 60,
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end">
          <CommonTooltip content="Delete">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete(String(item.id))}
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
