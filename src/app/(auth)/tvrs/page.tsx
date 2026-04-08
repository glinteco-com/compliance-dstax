'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommonTable, type Column } from '@/components/table/CommonTable'
import { Eye, Search } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { useDebounce } from '@/hooks/useDebounce'
import { useApiTaxComplianceTvrPeriodActivesList } from '@/api/generated/tax-compliance-tvr-period/tax-compliance-tvr-period'
import type { TVRPeriod } from '@/models'

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PREPARED: 'Prepared',
  REVIEW_COMMENTS: 'Review Comments',
  PUBLISHED: 'Published',
  FUNDING_RECEIVED: 'Funding Received',
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  PREPARED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  REVIEW_COMMENTS:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  PUBLISHED:
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  FUNDING_RECEIVED:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
}

function TVRsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientIdParam = searchParams.get('clientId')
  const legalEntityIdParam = searchParams.get('legalEntityId')
  const filterClientId = clientIdParam ? Number(clientIdParam) : null
  const filterLegalEntityId = legalEntityIdParam
    ? Number(legalEntityIdParam)
    : null

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const { data, isLoading } = useApiTaxComplianceTvrPeriodActivesList()

  const tvrPeriods = React.useMemo(() => {
    let items = (data?.results as unknown as TVRPeriod[]) ?? []
    if (filterClientId) {
      items = items.filter((p) => p.client_id === filterClientId)
    }
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter((p) => p.client.name.toLowerCase().includes(q))
  }, [data, search, filterClientId])

  const totalPages = Math.ceil(tvrPeriods.length / pageSize)

  const paginatedData = React.useMemo(
    () =>
      tvrPeriods.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [tvrPeriods, currentPage, pageSize]
  )

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const columns: Column<TVRPeriod>[] = [
    {
      id: 'record_id',
      label: 'Record ID',
      width: 100,
      align: 'center',
      render: (record) => record.id,
    },
    {
      id: 'clientName',
      label: 'Client Name',
      render: (record) => (
        <span className="font-medium">{record.client.name}</span>
      ),
    },
    {
      id: 'period',
      label: 'Period',
      width: 140,
      render: (record) => {
        const date = new Date(record.period_year, record.period_month - 1)
        return date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      },
    },
    {
      id: 'workflowStatus',
      label: 'Status',
      width: 180,
      render: (record) => {
        const status = record.workflow_status ?? 'DRAFT'
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? STATUS_COLORS.DRAFT}`}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        )
      },
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
              const url = filterLegalEntityId
                ? `/tvrs/${record.id}?legalEntityId=${filterLegalEntityId}`
                : `/tvrs/${record.id}`
              router.push(url)
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
          Tax Verification Reports (TVRs)
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
        data={paginatedData}
        isLoading={isLoading}
        emptyMessage="No TVR periods found"
        onRowClick={(record) => {
          const url = filterLegalEntityId
            ? `/tvrs/${record.id}?legalEntityId=${filterLegalEntityId}`
            : `/tvrs/${record.id}`
          router.push(url)
        }}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: tvrPeriods.length,
        }}
      />
    </div>
  )
}

export default function TVRsPage() {
  return (
    <Suspense>
      <TVRsContent />
    </Suspense>
  )
}
