'use client'

import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommonSelect } from '@/components/select/CommonSelect'
import { Search, Plus } from 'lucide-react'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { RoleEnum } from '@/models/roleEnum'
import { UserDrawer } from './components/UserDrawer'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'
import { useUsersPage } from './hooks/useUsersPage'

export default function UsersPage() {
  const { isDstaxAdmin, isSessionLoading } = useRole()
  const {
    searchInput,
    handleSearchChange,
    selectedRole,
    handleRoleChange,
    columns,
    paginatedData,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePageSizeChange,
    pageSize,
    totalItems,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedUserId,
    invalidateList,
    clientOptions,
    clientMap,
    isOpenDeleteDialog,
    setIsOpenDeleteDialog,
    handleConfirmDelete,
    isDeleting,
    openDrawer,
  } = useUsersPage()

  if (isSessionLoading) {
    return null
  }

  if (!isDstaxAdmin) {
    redirect('/')
  }

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Users
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage users and their access roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-40">
            <CommonSelect
              value={selectedRole}
              onChange={(v) => handleRoleChange(String(v))}
              options={[
                { value: 'ALL', label: 'All Roles' },
                { value: RoleEnum.DSTAX_ADMIN, label: 'DSTax Admin' },
                { value: RoleEnum.DSTAX_PREPARER, label: 'DSTax Preparer' },
                { value: RoleEnum.CLIENT_ADMIN, label: 'Client Admin' },
                { value: RoleEnum.CLIENT_STAFF, label: 'Client Staff' },
              ]}
              placeholder="All Roles"
            />
          </div>

          <div>
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>

          <Button
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            onClick={() => openDrawer('create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No users found"
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems,
        }}
      />

      <UserDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        mode={drawerMode}
        userId={selectedUserId}
        onSuccess={invalidateList}
        clientOptions={clientOptions}
        clientMap={clientMap}
      />

      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
