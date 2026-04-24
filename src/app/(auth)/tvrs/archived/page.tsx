'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommonTable } from '@/components/table/CommonTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiTaxComplianceTvrPeriodListWorkflowStatus } from '@/models/apiTaxComplianceTvrPeriodListWorkflowStatus'
import { useTvrArchivedPage } from './hooks/useTvrArchivedPage'
import { useTvrArchivedColumns } from './hooks/useTvrArchivedColumns'
import type { TVRPeriod } from '@/models'

const WORKFLOW_STATUS_LABELS: Record<
  ApiTaxComplianceTvrPeriodListWorkflowStatus,
  string
> = {
  DRAFT: 'Draft',
  PREPARED: 'Prepared',
  REVIEW_COMMENTS: 'Review Comments',
  PUBLISHED: 'Published',
  FUNDING_RECEIVED: 'Funding Received',
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function ArchivedContent() {
  const {
    periodMonth,
    setPeriodMonth,
    periodYear,
    setPeriodYear,
    workflowStatus,
    setWorkflowStatus,
    createdAtGte,
    setCreatedAtGte,
    createdAtLte,
    setCreatedAtLte,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
    data,
    isLoading,
    totalPages,
    clearFilters,
    hasActiveFilters,
  } = useTvrArchivedPage()

  const columns = useTvrArchivedColumns()

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Archived TVR Periods
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All TVR periods including expired records.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Select
          value={workflowStatus ?? ''}
          onValueChange={(value) =>
            setWorkflowStatus(
              value
                ? (value as ApiTaxComplianceTvrPeriodListWorkflowStatus)
                : undefined
            )
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(WORKFLOW_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={periodMonth !== undefined ? String(periodMonth) : ''}
          onValueChange={(value) =>
            setPeriodMonth(value ? Number(value) : undefined)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((name, index) => (
              <SelectItem key={index + 1} value={String(index + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="">
          <Input
            type="number"
            placeholder="Year (e.g. 2024)"
            className="w-36"
            value={periodYear ?? ''}
            onChange={(e) =>
              setPeriodYear(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-500">From</span>
          <Input
            type="date"
            className="w-40"
            value={createdAtGte ?? ''}
            onChange={(e) => setCreatedAtGte(e.target.value || undefined)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-500">To</span>
          <Input
            type="date"
            className="w-40"
            value={createdAtLte ?? ''}
            onChange={(e) => setCreatedAtLte(e.target.value || undefined)}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <CommonTable
        columns={columns}
        data={
          (data?.results as unknown as (TVRPeriod & {
            created_at?: string
          })[]) ?? []
        }
        isLoading={isLoading}
        emptyMessage="No archived TVR periods found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: data?.count ?? 0,
        }}
      />
    </div>
  )
}

export default function ArchivedTvrPage() {
  return (
    <Suspense>
      <ArchivedContent />
    </Suspense>
  )
}
