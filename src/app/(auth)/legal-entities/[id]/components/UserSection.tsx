'use client'

import { useState } from 'react'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { useUsers } from '../../../users/hooks/useUsers'
import { User } from '@/models/user'

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

interface UserSectionProps {
  title: string
  entityId: number
  role: string
}

export function UserSection({ title, entityId, role }: UserSectionProps) {
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
          onPageSizeChange: (size) => {
            setPageSize(size)
            setPage(1)
          },
          pageSize,
          totalItems: data?.count ?? 0,
        }}
      />
    </div>
  )
}
