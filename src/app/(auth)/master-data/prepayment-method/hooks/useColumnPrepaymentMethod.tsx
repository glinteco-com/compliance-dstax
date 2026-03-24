'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { PrepaymentMethod } from '@/models/prepaymentMethod'

interface UseColumnPrepaymentMethodProps {
  onDelete: (id: string) => void
}

export const useColumnPrepaymentMethod = ({
  onDelete,
}: UseColumnPrepaymentMethodProps) => {
  const columns: Column<PrepaymentMethod>[] = [
    {
      id: 'state',
      label: 'State',
      width: 100,
      render: (item) => (
        <span className="font-semibold text-zinc-900 uppercase dark:text-zinc-100">
          {item.jurisdiction?.name || ''}
        </span>
      ),
    },
    {
      id: 'method_description',
      label: 'Prepayment Method',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.method_description}
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
