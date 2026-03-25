'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { User } from '@/models/user'

type UserWithId = User & { id: number }

interface UseColumnDstaxPreparerProps {
  onView: (item: UserWithId) => void
  onEdit: (item: UserWithId) => void
  onDelete: (id: string) => void
  clientMap?: Record<number, string>
}

export const useColumnDstaxPreparer = ({
  onView,
  onEdit,
  onDelete,
  clientMap = {},
}: UseColumnDstaxPreparerProps) => {
  const columns: Column<UserWithId>[] = [
    {
      id: 'index',
      label: '#',
      width: 60,
      render: (_item, index) => (
        <span className="font-mono text-xs text-zinc-500">{index + 1}</span>
      ),
    },
    {
      id: 'managed_client',
      label: 'Managed Client ID',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.managed_client
            ? (clientMap[item.managed_client] ?? item.managed_client)
            : '—'}
        </span>
      ),
    },
    {
      id: 'assigned_legal_entities',
      label: 'Assigned Legal Entities',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.assigned_legal_entities?.length
            ? item.assigned_legal_entities.map((le) => le.name).join(', ')
            : '—'}
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
