'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { EfileRecord } from './useEfileRecords'

interface UseColumnEfileProps {
  onView: (item: EfileRecord) => void
  onEdit: (item: EfileRecord) => void
  onDelete: (id: number) => void
}

export const useColumnEfile = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnEfileProps) => {
  const columns: Column<EfileRecord>[] = [
    {
      id: 'legal_entity',
      label: 'Legal Entity',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.legal_entity}
        </span>
      ),
    },
    {
      id: 'state_jurisdiction',
      label: 'State/Jur.',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.state_jurisdiction}
        </span>
      ),
    },
    {
      id: 'account_number',
      label: 'Acct #',
      render: (item) => (
        <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
          {item.account_number}
        </span>
      ),
    },
    {
      id: 'user',
      label: 'User',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">{item.user}</span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 140,
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <CommonTooltip content="View Details">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => onView(item)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Edit">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => onEdit(item)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CommonTooltip>
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
