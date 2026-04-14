import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import useDialog from '@/hooks/useDialog'
import { useColumnClientUser } from './useColumnClientUser'
import { useUsers } from './useUsers'
import { User } from '@/models/user'
import {
  useApiCoreUserDestroy,
  getApiCoreUserListQueryKey,
} from '@/api/generated/core-user/core-user'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { PaginatedClientList } from '@/models/paginatedClientList'

type UserWithId = User & { id: number }

export function useUsersPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  )
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 400)
  const [selectedRole, setSelectedRole] = useState<string>('ALL')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    setCurrentPage(1)
  }

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

  const clientMap = useMemo(() => {
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

  return {
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
    totalItems: data?.count ?? 0,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedUserId,
    invalidateList,
    clientMap,
    isOpenDeleteDialog,
    setIsOpenDeleteDialog,
    handleConfirmDelete,
    isDeleting,
    openDrawer,
  }
}
