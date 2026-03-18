'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { TaxType } from '@/types/tax-type'

interface UseColumnTaxTypeProps {
  onDelete: (id: string) => void
}

export const useColumnTaxType = ({ onDelete }: UseColumnTaxTypeProps) => {
  const columns: Column<TaxType>[] = [
    {
      id: 'type',
      label: 'Type',
      width: 150,
      render: (item) => (
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {item.type}
        </span>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.description}
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
