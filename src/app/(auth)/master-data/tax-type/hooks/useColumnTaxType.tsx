'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { TaxType } from '@/models/taxType'

interface UseColumnTaxTypeProps {
  onDelete: (id: string) => void
}

export const useColumnTaxType = ({ onDelete }: UseColumnTaxTypeProps) => {
  const columns: Column<TaxType>[] = [
    {
      id: 'id',
      label: 'ID',
      width: 100,
      render: (item) => (
        <span className="font-mono text-xs text-zinc-500">{item.id}</span>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.name}
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
