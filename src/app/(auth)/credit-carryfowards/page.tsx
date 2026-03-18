'use client'

import * as React from 'react'
import { CommonTable } from '@/components/table/CommonTable'
import { useColumnCreditCarryforward } from './hooks/useColumnCreditCarryforward'
import { CreditCarryforward } from '@/types/credit-carryforward'

const mockData: CreditCarryforward[] = [
  {
    id: '1',
    client: 'Acme Corp',
    legalEntity: 'Acme Logistics LLC',
    jurisdiction: 'CA',
    priorBalance: 1250.0,
    currentPeriod: -250.0,
    endingBalance: 1000.0,
  },
  {
    id: '2',
    client: 'GloboChem',
    legalEntity: 'GloboChem Retail Inc',
    jurisdiction: 'TX',
    priorBalance: 0.0,
    currentPeriod: 500.5,
    endingBalance: 500.5,
  },
  {
    id: '3',
    client: 'Stark Industries',
    legalEntity: 'Stark Energy Corp',
    jurisdiction: 'NY',
    priorBalance: 5200.0,
    currentPeriod: 1000.0,
    endingBalance: 6200.0,
  },
  {
    id: '4',
    client: 'Wayne Enterprises',
    legalEntity: 'W.E. Manufacturing',
    jurisdiction: 'OH',
    priorBalance: 800.25,
    currentPeriod: -100.25,
    endingBalance: 700.0,
  },
  {
    id: '5',
    client: 'Cyberdyne',
    legalEntity: 'Cyberdyne Research',
    jurisdiction: 'WA',
    priorBalance: 15.75,
    currentPeriod: 34.25,
    endingBalance: 50.0,
  },
  {
    id: '6',
    client: 'Initech',
    legalEntity: 'Initech Solutions',
    jurisdiction: 'FL',
    priorBalance: 200.0,
    currentPeriod: 0.0,
    endingBalance: 200.0,
  },
]

export default function CreditCarryfowardsPage() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const totalPages = Math.ceil(mockData.length / pageSize)

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return mockData.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize])

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const { columns } = useColumnCreditCarryforward()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Credit Carryforwards
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            View and manage tax credit balances across clients and
            jurisdictions.
          </p>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No credit balances found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: mockData.length,
        }}
      />
    </div>
  )
}
