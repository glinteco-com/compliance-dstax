'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CommonTable } from '@/components/table/CommonTable'
import { useDebounce } from '@/hooks/useDebounce'
import { useLegalEntities } from '../legal-entities/hooks/useLegalEntities'
import { useTvrPeriods } from '../../tvrs/hooks/useTvrPeriods'
import { useUsers } from '../users/hooks/useUsers'
import { LegalEntity } from '@/models/legalEntity'
import { TVRPeriod } from '@/models/tVRPeriod'
import { User } from '@/models/user'
import { Column } from '@/components/table/CommonTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ExternalLink } from 'lucide-react'
import { RoleEnum } from '@/models/roleEnum'

type LegalEntityWithId = LegalEntity & { id: number }
type TVRPeriodWithId = TVRPeriod & { id: number }
type UserWithId = User & { id: number }

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const WORKFLOW_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PREPARED: 'Prepared',
  REVIEW_COMMENTS: 'Review Comments',
  PUBLISHED: 'Published',
  FUNDING_RECEIVED: 'Funding Received',
}

const ROLE_LABELS: Record<string, string> = {
  DSTAX_ADMIN: 'DSTax Admin',
  DSTAX_PREPARER: 'DSTax Preparer',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_STAFF: 'Client Staff',
}

interface ClientDetailViewProps {
  clientId: number
  clientName: string
  showUsers?: boolean
}

export function ClientDetailView({
  clientId,
  clientName,
  showUsers = false,
}: ClientDetailViewProps) {
  const router = useRouter()

  // Legal entities
  const [leSearchInput, setLeSearchInput] = React.useState('')
  const leSearch = useDebounce(leSearchInput, 400)
  const [lePage, setLePage] = React.useState(1)
  const [lePageSize, setLePageSize] = React.useState(10)

  React.useEffect(() => {
    setLePage(1)
  }, [leSearch])

  const { data: leData, isLoading: isLoadingLe } = useLegalEntities({
    page: lePage,
    pageSize: lePageSize,
    search: leSearch || undefined,
    clientId,
  })

  const legalEntities = (leData?.results ?? []) as LegalEntityWithId[]
  const leTotalPages = Math.ceil((leData?.count ?? 0) / lePageSize)

  // TVR periods
  const [tvrPage, setTvrPage] = React.useState(1)
  const [tvrPageSize, setTvrPageSize] = React.useState(10)

  const { data: tvrData, isLoading: isLoadingTvr } = useTvrPeriods({
    page: tvrPage,
    pageSize: tvrPageSize,
    clientId,
  })

  const tvrPeriods = (tvrData?.results ?? []) as TVRPeriodWithId[]
  const tvrTotalPages = Math.ceil((tvrData?.count ?? 0) / tvrPageSize)

  // Users (only fetched when showUsers is true)
  const [usersPage, setUsersPage] = React.useState(1)
  const [usersPageSize, setUsersPageSize] = React.useState(10)

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    page: usersPage,
    pageSize: usersPageSize,
    managedClientId: clientId,
  })

  const users = (usersData?.results ?? []) as UserWithId[]
  const usersTotalPages = Math.ceil((usersData?.count ?? 0) / usersPageSize)

  // Column definitions
  const leColumns: Column<LegalEntityWithId>[] = [
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
  ]

  const tvrColumns: Column<TVRPeriodWithId>[] = [
    {
      id: 'index',
      label: '#',
      width: 60,
      render: (_item, index) => (
        <span className="font-mono text-xs text-zinc-500">{index + 1}</span>
      ),
    },
    {
      id: 'period',
      label: 'Period',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {MONTH_NAMES[(item.period_month ?? 1) - 1]} {item.period_year}
        </span>
      ),
    },
    {
      id: 'workflow_status',
      label: 'Status',
      render: (item) => (
        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-700/10 ring-inset dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10">
          {WORKFLOW_STATUS_LABELS[item.workflow_status ?? ''] ??
            item.workflow_status ??
            '—'}
        </span>
      ),
    },
    {
      id: 'is_expired',
      label: 'Expired',
      width: 100,
      render: (item) => (
        <span
          className={
            item.is_expired ? 'text-red-500 dark:text-red-400' : 'text-zinc-400'
          }
        >
          {item.is_expired ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 80,
      align: 'right',
      render: (item) => (
        <Link href={`/tvrs/${item.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View TVR</span>
          </Button>
        </Link>
      ),
    },
  ]

  const usersColumns: Column<UserWithId>[] = [
    {
      id: 'index',
      label: '#',
      width: 60,
      render: (_item, index) => (
        <span className="font-mono text-xs text-zinc-500">{index + 1}</span>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      render: (item) => (
        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-700/10 ring-inset dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10">
          {ROLE_LABELS[item.role] ?? item.role}
        </span>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.email}
        </span>
      ),
    },
    {
      id: 'assigned_legal_entities',
      label: 'Legal Entities',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {item.assigned_legal_entities?.length
            ? item.assigned_legal_entities.map((le) => le.name).join(', ')
            : '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Client Info */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Client Information
        </h3>
        <div className="grid gap-1">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {clientName}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            ID: {clientId}
          </span>
        </div>
      </div>

      {/* Legal Entities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Legal Entities
          </h3>
          <div>
            <Input
              placeholder="Search..."
              value={leSearchInput}
              onChange={(e) => setLeSearchInput(e.target.value)}
              className="w-48"
              prefixIcon={<Search />}
            />
          </div>
        </div>

        <CommonTable
          columns={leColumns}
          data={legalEntities}
          emptyMessage="No legal entities found"
          isLoading={isLoadingLe}
          onRowClick={(item) => router.push(`/legal-entities/${item.id}`)}
          pagination={{
            currentPage: lePage,
            totalPages: leTotalPages,
            onPageChange: setLePage,
            onPageSizeChange: (s) => {
              setLePageSize(s)
              setLePage(1)
            },
            pageSize: lePageSize,
            totalItems: leData?.count ?? 0,
          }}
        />
      </div>

      {/* TVR Periods */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          TVR Periods
        </h3>

        <CommonTable
          columns={tvrColumns}
          data={tvrPeriods}
          emptyMessage="No TVR periods found"
          isLoading={isLoadingTvr}
          pagination={{
            currentPage: tvrPage,
            totalPages: tvrTotalPages,
            onPageChange: setTvrPage,
            onPageSizeChange: (s) => {
              setTvrPageSize(s)
              setTvrPage(1)
            },
            pageSize: tvrPageSize,
            totalItems: tvrData?.count ?? 0,
          }}
        />
      </div>

      {/* Users — only for Client Admin */}
      {showUsers && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Users
          </h3>

          <CommonTable
            columns={usersColumns}
            data={users}
            emptyMessage="No users found"
            isLoading={isLoadingUsers}
            pagination={{
              currentPage: usersPage,
              totalPages: usersTotalPages,
              onPageChange: setUsersPage,
              onPageSizeChange: (s) => {
                setUsersPageSize(s)
                setUsersPage(1)
              },
              pageSize: usersPageSize,
              totalItems: usersData?.count ?? 0,
            }}
          />
        </div>
      )}
    </div>
  )
}
