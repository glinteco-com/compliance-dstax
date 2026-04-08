'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useApiCoreLegalEntityRetrieve } from '@/api/generated/core-legal-entity/core-legal-entity'
import { useApiCoreClientRetrieve } from '@/api/generated/core-client/core-client'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { useUsers } from '../../../(auth)/clients/users/hooks/useUsers'
import { User } from '@/models/user'
import { RoleEnum } from '@/models/roleEnum'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'

type UserWithId = User & { id: number }

const ROLE_LABELS: Record<string, string> = {
  DSTAX_ADMIN: 'DSTax Admin',
  DSTAX_PREPARER: 'DSTax Preparer',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_STAFF: 'Client Staff',
}

const userColumns: Column<UserWithId>[] = [
  {
    id: 'index',
    label: '#',
    width: 60,
    render: (_item, index) => (
      <span className="font-mono text-xs text-zinc-500">{index + 1}</span>
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
    id: 'role',
    label: 'Role',
    render: (item) => (
      <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-700/10 ring-inset dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10">
        {ROLE_LABELS[item.role] ?? item.role}
      </span>
    ),
  },
]

function UserSection({
  title,
  entityId,
  role,
}: {
  title: string
  entityId: number
  role: string
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading } = useUsers({
    page,
    pageSize,
    role,
    assignedLegalEntityId: entityId,
  })

  const users = (data?.results ?? []) as UserWithId[]
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <CommonTable
        columns={userColumns}
        data={users}
        emptyMessage={`No ${title.toLowerCase()} found`}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
          onPageSizeChange: (s) => {
            setPageSize(s)
            setPage(1)
          },
          pageSize,
          totalItems: data?.count ?? 0,
        }}
      />
    </div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function LegalEntityDetailPage({ params }: PageProps) {
  const { isDstaxAdmin, isDstaxPreparer, isSessionLoading } = useRole()
  const { id } = use(params)
  const entityId = Number(id)

  const { data: entity, isLoading } = useApiCoreLegalEntityRetrieve(entityId, {
    query: { enabled: !!entityId },
  })

  const e = entity as unknown as
    | {
        id: number
        name: string
        client: number | { id: number; name: string }
        is_active?: boolean
      }
    | undefined

  const clientId = e
    ? typeof e.client === 'object'
      ? e.client.id
      : e.client
    : 0

  const { data: clientData } = useApiCoreClientRetrieve(clientId, {
    query: { enabled: !!clientId },
  })

  if (isSessionLoading) {
    return null
  }

  if (!isDstaxAdmin && !isDstaxPreparer) {
    redirect('/')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        Loading...
      </div>
    )
  }

  if (!e) {
    return (
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        Legal entity not found.
      </div>
    )
  }

  const clientName = clientData?.name ?? '—'

  return (
    <div className="min-w-0 flex-1 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Link href="/legal-entities">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {e.name}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Legal entity details
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Basic Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Name
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {e.name}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Client
            </span>
            <Link
              href={`/clients/${clientId}`}
              className="font-semibold text-orange-500 hover:underline"
            >
              {clientName}
            </Link>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Status
            </span>
            <span
              className={
                e.is_active !== false
                  ? 'font-semibold text-green-600 dark:text-green-400'
                  : 'font-semibold text-zinc-400'
              }
            >
              {e.is_active !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Current TVR
            </span>
            <Link href={`/tvrs?clientId=${clientId}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-fit gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                View TVR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Client Staff */}
      <UserSection
        title="Client Staff"
        entityId={e.id}
        role={RoleEnum.CLIENT_STAFF}
      />

      {/* DSTax Preparers */}
      <UserSection
        title="DSTax Preparers"
        entityId={e.id}
        role={RoleEnum.DSTAX_PREPARER}
      />
    </div>
  )
}
