'use client'

import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { CreditCarryforward } from './useCreditCarryforwards'

interface UseColumnCreditCarryforwardProps {
  onView: (item: CreditCarryforward) => void
  onEdit: (item: CreditCarryforward) => void
  onDelete: (id: number) => void
}

const formatCurrency = (value: string) => {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(num))
  return num < 0 ? `-${formatted}` : formatted
}

export const useColumnCreditCarryforward = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnCreditCarryforwardProps) => {
  const columns: Column<CreditCarryforward>[] = [
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
      id: 'state',
      label: 'State',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">{item.state}</span>
      ),
    },
    {
      id: 'prior_amount',
      label: 'Prior ($)',
      align: 'right',
      render: (item) => {
        const num = parseFloat(item.prior_amount)
        return (
          <span
            className={
              num < 0
                ? 'font-mono text-sm text-red-600 dark:text-red-400'
                : 'font-mono text-sm text-zinc-700 dark:text-zinc-300'
            }
          >
            {formatCurrency(item.prior_amount)}
          </span>
        )
      },
    },
    {
      id: 'ending_amount',
      label: 'Ending ($)',
      align: 'right',
      render: (item) => {
        const num = parseFloat(item.ending_amount)
        return (
          <span
            className={
              num < 0
                ? 'font-mono text-sm text-red-600 dark:text-red-400'
                : 'font-mono text-sm text-emerald-600 dark:text-emerald-400'
            }
          >
            {formatCurrency(item.ending_amount)}
          </span>
        )
      },
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
