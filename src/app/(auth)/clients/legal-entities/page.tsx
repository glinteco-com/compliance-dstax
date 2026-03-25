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
import { useColumnLegalEntity } from './hooks/useColumnLegalEntity'
import { useLegalEntities } from './hooks/useLegalEntities'
import { LegalEntity } from '@/models/legalEntity'
import {
  useApiCoreLegalEntityCreate,
  useApiCoreLegalEntityUpdate,
  useApiCoreLegalEntityDestroy,
  getApiCoreLegalEntityListQueryKey,
} from '@/api/generated/core-legal-entity/core-legal-entity'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { PaginatedClientList } from '@/models/paginatedClientList'
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

type LegalEntityWithId = LegalEntity & { id: number }

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Must be 255 characters or less'),
  client: z.string().min(1, 'Client is required'),
  is_active: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function LegalEntitiesPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] =
    React.useState<LegalEntityWithId | null>(null)

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

  const { data, isLoading } = useLegalEntities({
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

  const clientOptions = clients.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  const clientMap = React.useMemo(() => {
    const map: Record<number, string> = {}
    clients.forEach((c) => {
      map[c.id] = c.name
    })
    return map
  }, [clients])

  const paginatedData = (data?.results ?? []) as LegalEntityWithId[]
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: getApiCoreLegalEntityListQueryKey(),
    })
  }

  const { mutate: createLegalEntity, isPending: isCreating } =
    useApiCoreLegalEntityCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Legal entity created successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: () => {
          toast.error('Failed to create legal entity.')
        },
      },
    })

  const { mutate: updateLegalEntity, isPending: isUpdating } =
    useApiCoreLegalEntityUpdate({
      mutation: {
        onSuccess: () => {
          toast.success('Legal entity updated successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: () => {
          toast.error('Failed to update legal entity.')
        },
      },
    })

  const { mutate: deleteLegalEntity, isPending: isDeleting } =
    useApiCoreLegalEntityDestroy({
      mutation: {
        onSuccess: () => {
          toast.success('Legal entity deleted successfully.')
          invalidateList()
          onCloseDeleteDialog()
        },
        onError: () => {
          toast.error('Failed to delete legal entity.')
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      client: '',
      is_active: 'true',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: LegalEntityWithId | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        name: item.name,
        client: String(item.client),
        is_active: item.is_active !== false ? 'true' : 'false',
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        client: '',
        is_active: 'true',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    const payload = {
      name: formData.name,
      client: Number(formData.client),
      is_active: formData.is_active !== 'false',
    }

    if (drawerMode === 'create') {
      createLegalEntity({ data: payload as any })
    } else if (drawerMode === 'edit' && selectedItem) {
      updateLegalEntity({
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
    deleteLegalEntity({ id: targetId })
  }

  const { columns } = useColumnLegalEntity({
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
            Legal Entities
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage legal entities associated with your clients.
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
            <Plus className="mr-2 h-4 w-4" /> Add Legal Entity
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No legal entities found"
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
              {drawerMode === 'create' && 'Add Legal Entity'}
              {drawerMode === 'edit' && 'Edit Legal Entity'}
              {drawerMode === 'view' && 'Legal Entity Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new legal entity.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected legal entity.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected legal entity.'}
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
                    Name
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.name}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Client
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {clientMap[selectedItem.client] ?? selectedItem.client}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Status
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}

            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="legal-entity-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Name',
                    placeholder: 'e.g. Global Tech US Inc',
                  }}
                />
                <FormController
                  control={control}
                  name="client"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Client',
                    placeholder: 'Select a client',
                    options: clientOptions,
                  }}
                />
                <FormController
                  control={control}
                  name="is_active"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Status',
                    placeholder: 'Select status',
                    options: [
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ],
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="legal-entity-form"
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
        title="Delete Legal Entity"
        description="Are you sure you want to delete this legal entity? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
