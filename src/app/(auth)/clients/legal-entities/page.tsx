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
import { useColumnClientSelect } from './hooks/useColumnClientSelect'
import { useLegalEntities } from './hooks/useLegalEntities'
import { useClients } from './hooks/useClients'
import { LegalEntity } from '@/models/legalEntity'
import { Client } from '@/models/client'
import {
  useApiCoreLegalEntityCreate,
  useApiCoreLegalEntityUpdate,
  useApiCoreLegalEntityDestroy,
  getApiCoreLegalEntityListQueryKey,
} from '@/api/generated/core-legal-entity/core-legal-entity'
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
import { getApiErrorMessage } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { BackButton } from '@/components/button/BackButton'

type ClientWithId = Client & { id: number }
type LegalEntityWithId = LegalEntity & { id: number }

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Must be 255 characters or less'),
  is_active: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function LegalEntitiesPage() {
  const queryClient = useQueryClient()

  const [selectedClient, setSelectedClient] =
    React.useState<ClientWithId | null>(null)

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

  // Client list state
  const [clientSearchInput, setClientSearchInput] = React.useState('')
  const clientSearch = useDebounce(clientSearchInput, 400)
  const [clientPage, setClientPage] = React.useState(1)
  const [clientPageSize, setClientPageSize] = React.useState(10)

  React.useEffect(() => {
    setClientPage(1)
  }, [clientSearch])

  const { data: clientsData, isLoading: isLoadingClients } = useClients({
    page: clientPage,
    pageSize: clientPageSize,
    search: clientSearch || undefined,
  })

  const clientList = (clientsData?.results ?? []) as ClientWithId[]
  const clientTotalPages = Math.ceil((clientsData?.count ?? 0) / clientPageSize)

  // Legal entity list state
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
    clientId: selectedClient?.id,
  })

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
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to create legal entity.')
          )
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
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to update legal entity.')
          )
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
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to delete legal entity.')
          )
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
        is_active: item.is_active !== false ? 'true' : 'false',
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        is_active: 'true',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    if (!selectedClient) return

    const payload = {
      name: formData.name,
      client: selectedClient.id,
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

  const handleSelectClient = (client: ClientWithId) => {
    setSelectedClient(client)
    setSearchInput('')
    setCurrentPage(1)
  }

  const handleBackToClients = () => {
    setSelectedClient(null)
    setSearchInput('')
    setCurrentPage(1)
  }

  const { columns: clientColumns } = useColumnClientSelect({
    onViewLegalEntities: handleSelectClient,
  })

  const { columns: legalEntityColumns } = useColumnLegalEntity({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
    clientMap: selectedClient
      ? { [selectedClient.id]: selectedClient.name }
      : {},
  })

  // Client list view
  if (!selectedClient) {
    return (
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Clients
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Select a client to view and manage their legal entities.
            </p>
          </div>
          <div className="relative">
            <Input
              placeholder="Search clients..."
              value={clientSearchInput}
              onChange={(e) => setClientSearchInput(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>
        </div>

        <CommonTable
          columns={clientColumns}
          data={clientList}
          emptyMessage="No clients found"
          isLoading={isLoadingClients}
          onRowClick={handleSelectClient}
          pagination={{
            currentPage: clientPage,
            totalPages: clientTotalPages,
            onPageChange: setClientPage,
            onPageSizeChange: (newSize) => {
              setClientPageSize(newSize)
              setClientPage(1)
            },
            pageSize: clientPageSize,
            totalItems: clientsData?.count ?? 0,
          }}
        />
      </div>
    )
  }

  // Legal entities view for selected client
  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {selectedClient.name}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Legal entities for this client.
            </p>
          </div>
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
        columns={legalEntityColumns}
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
                    {selectedClient.name}
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
