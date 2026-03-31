'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommonTable, type Column } from '@/components/table/CommonTable'
import { Eye, Search } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { useDebounce } from '@/hooks/useDebounce'
import { mockClients, type TVRClient } from './mock-data'

export default function TVRsPage() {
  const router = useRouter()
  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const filteredClients = React.useMemo(() => {
    if (!search) return mockClients
    const q = search.toLowerCase()
    return mockClients.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.legalEntities.some((le) => le.toLowerCase().includes(q))
    )
  }, [search])

  const columns: Column<TVRClient>[] = [
    {
      id: 'index',
      label: '#',
      width: 60,
      align: 'center',
      render: (_, index) => index + 1,
    },
    {
      id: 'clientName',
      label: 'Client Name',
      render: (record) => (
        <span className="font-medium">{record.clientName}</span>
      ),
    },
    {
      id: 'legalEntities',
      label: 'Legal Entities',
      render: (record) => (
        <div className="flex flex-wrap gap-1">
          {record.legalEntities.map((le) => (
            <span
              key={le}
              className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {le}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'action',
      label: 'Action',
      width: 100,
      align: 'center',
      render: (record) => (
        <CommonTooltip content="View TVR Detail">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/tvrs/${record.id}`)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </CommonTooltip>
      ),
    },
  ]

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Tax Verification Reports (TVRs) — March 2026
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="Search clients..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>
        </div>
      </div>
      <CommonTable
        columns={columns}
        data={filteredClients}
        emptyMessage="No clients with TVRs this month"
        onRowClick={(record) => router.push(`/tvrs/${record.id}`)}
      />
    </div>
  )
}
