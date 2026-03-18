'use client'

import { Column } from '@/components/table/CommonTable'
import { CreditCarryforward } from '@/types/credit-carryforward'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const useColumnCreditCarryforward = () => {
  const columns: Column<CreditCarryforward>[] = [
    {
      id: 'client',
      label: 'Client',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.client}
        </span>
      ),
    },
    {
      id: 'legalEntity',
      label: 'Legal Entity',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.legalEntity}
        </span>
      ),
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.jurisdiction}
        </span>
      ),
    },
    {
      id: 'priorBalance',
      label: 'Prior Balance',
      align: 'right',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {formatCurrency(item.priorBalance)}
        </span>
      ),
    },
    {
      id: 'currentPeriod',
      label: 'Current Period',
      align: 'right',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {formatCurrency(item.currentPeriod)}
        </span>
      ),
    },
    {
      id: 'endingBalance',
      label: 'Ending Balance',
      align: 'right',
      render: (item) => (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {formatCurrency(item.endingBalance)}
        </span>
      ),
    },
  ]

  return { columns }
}
