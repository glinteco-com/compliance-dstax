'use client'

import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus } from 'lucide-react'
import { getApiErrorMessage } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useColumnClientUser } from './hooks/useColumnClientUser'
import { useUsers } from './hooks/useUsers'
import { User } from '@/models/user'
import { RoleEnum } from '@/models/roleEnum'
import {
  useApiCoreUserDestroy,
  getApiCoreUserListQueryKey,
} from '@/api/generated/core-user/core-user'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { PaginatedClientList } from '@/models/paginatedClientList'
import { UserDrawer } from './components/UserDrawer'

type UserWithId = User & { id: number }

export default function UsersPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null
  )

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)
  const [selectedRole, setSelectedRole] = React.useState<string>('ALL')

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedRole])

  const { data, isLoading } = useUsers({
    page: currentPage,
    pageSize,
    search: search || undefined,
    role: selectedRole === 'ALL' ? undefined : selectedRole,
  })

  const { data: clientsData } = useApiCoreClientList({
    page: 1,
    page_size: 100,
  })

  const clients = ((clientsData as unknown as PaginatedClientList)?.results ??
    []) as { id: number; name: string }[]

  const clientOptions = [
    { value: '', label: 'None' },
    ...clients.map((c) => ({
      value: String(c.id),
      label: c.name,
    })),
  ]

  const clientMap = React.useMemo(() => {
    const map: Record<number, string> = {}
    clients.forEach((c) => {
      map[c.id] = c.name
    })
    return map
  }, [clients])

  const paginatedData = (data?.results ?? []) as UserWithId[]
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: getApiCoreUserListQueryKey(),
    })
  }

  const { mutate: deleteUser, isPending: isDeleting } = useApiCoreUserDestroy({
    mutation: {
      onSuccess: () => {
        toast.success('User deleted successfully.')
        invalidateList()
        onCloseDeleteDialog()
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to delete user.'))
      },
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: UserWithId | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedUserId(item?.id ?? null)
    setIsDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    setTargetId(Number(id))
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = () => {
    if (!targetId) return
    deleteUser({ id: targetId })
  }

  const { columns } = useColumnClientUser({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
    clientMap,
  })

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Users
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage users for each client and their access roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value={RoleEnum.DSTAX_ADMIN}>DSTax Admin</SelectItem>
              <SelectItem value={RoleEnum.DSTAX_PREPARER}>
                DSTax Preparer
              </SelectItem>
              <SelectItem value={RoleEnum.CLIENT_ADMIN}>
                Client Admin
              </SelectItem>
              <SelectItem value={RoleEnum.CLIENT_STAFF}>
                Client Staff
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
          totalItems: data?.count ?? 0,
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
