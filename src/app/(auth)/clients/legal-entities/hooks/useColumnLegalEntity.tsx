'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { LegalEntity } from '@/models/legalEntity'

type LegalEntityWithId = LegalEntity & { id: number }

interface UseColumnLegalEntityProps {
  onView: (item: LegalEntityWithId) => void
  onEdit: (item: LegalEntityWithId) => void
  onDelete: (id: string) => void
  clientMap?: Record<number, string>
}

export const useColumnLegalEntity = ({
  onView,
  onEdit,
  onDelete,
  clientMap = {},
}: UseColumnLegalEntityProps) => {
  const columns: Column<LegalEntityWithId>[] = [
    {
      id: 'index',
      label: '#',
      width: 60,
      render: (_item, index) => (
        <span className="font-mono text-xs text-zinc-500">{index + 1}</span>
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
      id: 'client',
      label: 'Client',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {clientMap[item.client] ?? item.client}
        </span>
      ),
    },
    {
      id: 'is_active',
      label: 'Status',
      width: 120,
      render: (item) => (
        <span
          className={
            item.is_active !== false
              ? 'text-green-600 dark:text-green-400'
              : 'text-zinc-400'
          }
        >
          {item.is_active !== false ? 'Active' : 'Inactive'}
        </span>
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
