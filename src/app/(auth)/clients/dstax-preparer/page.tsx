'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormController from '@/components/form/FormController'
import { CommonSelect } from '@/components/select/CommonSelect'
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
import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import { PaginatedLegalEntityList } from '@/models/paginatedLegalEntityList'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Search, Plus } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

type UserWithId = User & { id: number }

const formSchema = z.object({
  managed_client: z.string().optional(),
  assigned_legal_entity_ids: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

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

  const { data: legalEntitiesData } = useApiCoreLegalEntityList({
    page: 1,
    page_size: 100,
  })

  const legalEntities = ((
    legalEntitiesData as unknown as PaginatedLegalEntityList
  )?.results ?? []) as unknown as { id: number; name: string }[]

  const legalEntityOptions = legalEntities
    .filter((le) => le.id != null)
    .map((le) => ({
      value: String(le.id),
      label: le.name,
    }))

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
        onError: () => {
          toast.error('Failed to create preparer.')
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
        onError: () => {
          toast.error('Failed to update preparer.')
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
        onError: () => {
          toast.error('Failed to delete preparer.')
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managed_client: '',
      assigned_legal_entity_ids: '',
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

    if (mode === 'edit' && item) {
      reset({
        managed_client: item.managed_client ? String(item.managed_client) : '',
        assigned_legal_entity_ids: item.assigned_legal_entity_ids?.length
          ? String(item.assigned_legal_entity_ids[0])
          : '',
      })
    } else if (mode === 'create') {
      reset({
        managed_client: '',
        assigned_legal_entity_ids: '',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    const entityId = formData.assigned_legal_entity_ids
      ? Number(formData.assigned_legal_entity_ids)
      : null
    const payload = {
      role: 'DSTAX_PREPARER' as const,
      managed_client: formData.managed_client
        ? Number(formData.managed_client)
        : null,
      assigned_legal_entity_ids: entityId && !isNaN(entityId) ? [entityId] : [],
    }

    if (drawerMode === 'create') {
      createPreparer({ data: payload as any })
    } else if (drawerMode === 'edit' && selectedItem) {
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

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {drawerMode === 'create' && 'Add Preparer'}
              {drawerMode === 'edit' && 'Edit Preparer'}
              {drawerMode === 'view' && 'Preparer Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new preparer.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected preparer.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected preparer.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    ID
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.id}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Role
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    DSTax Preparer
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Managed Client
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.managed_client
                      ? (clientMap[selectedItem.managed_client] ??
                        selectedItem.managed_client)
                      : '—'}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Assigned Legal Entities
                  </span>
                  {selectedItem.assigned_legal_entities?.length ? (
                    <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                      {selectedItem.assigned_legal_entities.map((le) => (
                        <li key={le.name}>{le.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-400">—</span>
                  )}
                </div>
              </div>
            )}

            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="preparer-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="managed_client"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Managed Client',
                    placeholder: 'Select a client',
                    options: clientOptions,
                  }}
                />
                <FormController
                  control={control}
                  name="assigned_legal_entity_ids"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Assigned Legal Entity',
                    placeholder: 'Select a legal entity',
                    options: legalEntityOptions,
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="preparer-form"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
