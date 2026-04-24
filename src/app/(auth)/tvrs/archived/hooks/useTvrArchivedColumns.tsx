import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import type { Column } from '@/components/table/CommonTable'
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

type TVRPeriodWithMeta = TVRPeriod & { created_at?: string }

export function useTvrArchivedColumns() {
  const router = useRouter()

  const columns: Column<TVRPeriodWithMeta>[] = [
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
      id: 'isExpired',
      label: 'Expired',
      width: 100,
      align: 'center',
      render: (record) => (
        <span
          className={
            record.is_expired
              ? 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }
        >
          {record.is_expired ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      width: 140,
      render: (record) =>
        record.created_at
          ? new Date(record.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
    {
      id: 'action',
      label: 'Action',
      width: 80,
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

  return columns
}
