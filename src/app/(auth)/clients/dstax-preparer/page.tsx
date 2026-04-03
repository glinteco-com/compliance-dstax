'use client'

import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useColumnDstaxPreparer } from './hooks/useColumnDstaxPreparer'
import { usePreparers } from './hooks/usePreparers'
import { User } from '@/models/user'
import {
  useApiCoreUserCreate,
  useApiCoreUserUpdate,
  useApiCoreUserDestroy,
  getApiCoreUserListQueryKey,
} from '@/api/generated/core-user/core-user'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { PaginatedClientList } from '@/models/paginatedClientList'
import { Search, Plus } from 'lucide-react'
import { getApiErrorMessage } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { PreparerDrawer } from './components/PreparerDrawer'

type UserWithId = User & { id: number }

export default function PreparersPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<UserWithId | null>(
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

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const { data, isLoading } = usePreparers({
    page: currentPage,
    pageSize,
    search: search || undefined,
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

  const { mutate: createPreparer, isPending: isCreating } =
    useApiCoreUserCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Preparer created successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to create preparer.'))
        },
      },
    })

  const { mutate: updatePreparer, isPending: isUpdating } =
    useApiCoreUserUpdate({
      mutation: {
        onSuccess: () => {
          toast.success('Preparer updated successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to update preparer.'))
        },
      },
    })

  const { mutate: deletePreparer, isPending: isDeleting } =
    useApiCoreUserDestroy({
      mutation: {
        onSuccess: () => {
          toast.success('Preparer deleted successfully.')
          invalidateList()
          onCloseDeleteDialog()
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to delete preparer.'))
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
    setSelectedItem(item)
    setIsDrawerOpen(true)
  }

  const handleDrawerSubmit = (
    formData: {
      managed_client?: string
      assigned_legal_entity_ids?: string[]
    },
    mode: 'create' | 'edit'
  ) => {
    const payload = {
      role: 'DSTAX_PREPARER' as const,
      managed_client: formData.managed_client
        ? Number(formData.managed_client)
        : null,
      assigned_legal_entity_ids:
        formData.assigned_legal_entity_ids
          ?.map(Number)
          .filter((id) => !isNaN(id)) ?? [],
    }

    if (mode === 'create') {
      createPreparer({ data: payload as any })
    } else if (mode === 'edit' && selectedItem) {
      updatePreparer({
        id: selectedItem.id,
        data: payload as any,
      })
    }
  }

  const handleDelete = (id: string) => {
    setTargetId(Number(id))
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = () => {
    if (!targetId) return
    deletePreparer({ id: targetId })
  }

  const { columns } = useColumnDstaxPreparer({
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
            DSTax Preparers
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage the list of DSTax preparers and their assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            <Plus className="mr-2 h-4 w-4" /> Add Preparer
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No preparers found"
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

      <PreparerDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        mode={drawerMode}
        selectedItem={selectedItem}
        clientOptions={clientOptions}
        clientMap={clientMap}
        onSubmit={handleDrawerSubmit}
        isSaving={isCreating || isUpdating}
      />

      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Preparer"
        description="Are you sure you want to delete this preparer? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
