'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { Jurisdiction } from '@/types/jurisdictions'

interface UseColumnJurisdictionProps {
  onView: (item: Jurisdiction) => void
  onEdit: (item: Jurisdiction) => void
  onDelete: (id: string) => void
}

export const useColumnJurisdiction = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnJurisdictionProps) => {
  const columns: Column<Jurisdiction>[] = [
    {
      id: 'name',
      label: 'Jurisdiction Name',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.name}
        </span>
      ),
    },
    {
      id: 'level',
      label: 'Level',
      render: (item) => (
        <span className="text-zinc-700 capitalize dark:text-zinc-300">
          {item.level}
        </span>
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">{item.dueDate}</span>
      ),
    },
    {
      id: 'dueDateTime',
      label: 'Due Date Time',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.dueDateTime}
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
