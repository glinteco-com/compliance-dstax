'use client'

import { useRouter } from 'next/navigation'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Input } from '@/components/ui/input'
import { CommonSelect } from '@/components/select/CommonSelect'
import { Search } from 'lucide-react'
import { LegalEntity } from '@/models/legalEntity'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'
import { useLegalEntitiesPage } from './hooks/useLegalEntitiesPage'

type LegalEntityWithId = LegalEntity & { id: number }

export default function LegalEntitiesPage() {
  const { isDstaxAdmin, isDstaxPreparer, isSessionLoading } = useRole()
  const router = useRouter()
  const {
    searchInput,
    handleSearchChange,
    selectedClientId,
    handleClientChange,
    selectedStatus,
    handleStatusChange,
    clients,
    clientMap,
    entities,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePageSizeChange,
    pageSize,
    totalItems,
  } = useLegalEntitiesPage()

  if (isSessionLoading) {
    return null
  }

  if (!isDstaxAdmin && !isDstaxPreparer) {
    redirect('/')
  }

  const columns: Column<LegalEntityWithId>[] = [
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
      id: 'client',
      label: 'Client',
      render: (item) => (
        <span className="text-zinc-700 dark:text-zinc-300">
          {clientMap[item.client] ?? item.client}
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

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Legal Entities
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Browse and filter all legal entities across clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div>
            <Input
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>

          <div className="w-48">
            <CommonSelect
              value={selectedClientId}
              onChange={(v) => handleClientChange(String(v))}
              options={[
                { value: 'ALL', label: 'All Clients' },
                ...clients.map((c) => ({ value: String(c.id), label: c.name })),
              ]}
              placeholder="All Clients"
            />
          </div>

          <div className="w-36">
            <CommonSelect
              value={selectedStatus}
              onChange={(v) => handleStatusChange(String(v))}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={entities}
        emptyMessage="No legal entities found"
        isLoading={isLoading}
        onRowClick={(item) => router.push(`/legal-entities/${item.id}`)}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems,
        }}
      />
    </div>
  )
}
