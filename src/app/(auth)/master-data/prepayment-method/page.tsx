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
import { Plus, Search } from 'lucide-react'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import FormController from '@/components/form/FormController'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useColumnPrepaymentMethod } from './hooks/useColumnPrepaymentMethod'
import { usePrepaymentMethods } from './hooks/usePrepaymentMethods'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useApiTaxCompliancePrepaymentMethodsCreate,
  useApiTaxCompliancePrepaymentMethodsUpdate,
  useApiTaxCompliancePrepaymentMethodsDestroy,
  getApiTaxCompliancePrepaymentMethodsListQueryKey,
} from '@/api/generated/tax-compliance-prepayment-method/tax-compliance-prepayment-method'
import { PrepaymentMethod } from '@/models/prepaymentMethod'

const formSchema = z.object({
  jurisdiction_id: z.coerce
    .number({ required_error: 'Jurisdiction ID is required' })
    .min(1, 'Jurisdiction ID is required'),
  method_description: z
    .string()
    .min(1, 'Prepayment Method is required')
    .max(255, 'Must be 255 characters or less'),
})

type FormValues = z.infer<typeof formSchema>

export default function PrepaymentMethodPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] =
    React.useState<PrepaymentMethod | null>(null)

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

  const { data, isLoading } = usePrepaymentMethods({
    page: currentPage,
    pageSize,
    search: search || undefined,
  })

  const paginatedData = data?.results ?? []
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: getApiTaxCompliancePrepaymentMethodsListQueryKey(),
    })
  }

  const { mutate: createMethod, isPending: isCreating } =
    useApiTaxCompliancePrepaymentMethodsCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Prepayment method created successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: () => {
          toast.error('Failed to create prepayment method.')
        },
      },
    })

  const { mutate: updateMethod, isPending: isUpdating } =
    useApiTaxCompliancePrepaymentMethodsUpdate({
      mutation: {
        onSuccess: () => {
          toast.success('Prepayment method updated successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: () => {
          toast.error('Failed to update prepayment method.')
        },
      },
    })

  const { mutate: deleteMethod, isPending: isDeleting } =
    useApiTaxCompliancePrepaymentMethodsDestroy({
      mutation: {
        onSuccess: () => {
          toast.success('Prepayment method deleted successfully.')
          invalidateList()
          onCloseDeleteDialog()
        },
        onError: () => {
          toast.error('Failed to delete prepayment method.')
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { jurisdiction_id: undefined, method_description: '' },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: PrepaymentMethod | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        jurisdiction_id: item.jurisdiction_id,
        method_description: item.method_description,
      })
    } else if (mode === 'create') {
      reset({ jurisdiction_id: undefined, method_description: '' })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    if (drawerMode === 'create') {
      createMethod({
        data: {
          jurisdiction_id: formData.jurisdiction_id,
          method_description: formData.method_description,
        } as any,
      })
    } else if (drawerMode === 'edit' && selectedItem) {
      updateMethod({
        id: selectedItem.id,
        data: {
          jurisdiction_id: formData.jurisdiction_id,
          method_description: formData.method_description,
        } as any,
      })
    }
  }

  const handleDelete = (id: string) => {
    setTargetId(Number(id))
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = () => {
    if (!targetId) return
    deleteMethod({ id: targetId })
  }

  const { columns } = useColumnPrepaymentMethod({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Prepayment Method
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage prepayment methods for each state.
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
            <Plus className="mr-2 h-4 w-4" /> Add Method
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No prepayment methods found"
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

      {/* Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {drawerMode === 'create' && 'Add Prepayment Method'}
              {drawerMode === 'edit' && 'Edit Prepayment Method'}
              {drawerMode === 'view' && 'Prepayment Method Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter a jurisdiction and its corresponding prepayment method.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected prepayment method.'}
              {drawerMode === 'view' &&
                'Details of the selected prepayment method.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            {/* View mode */}
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    State
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.jurisdiction?.name || '-'}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Prepayment Method
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.method_description}
                  </span>
                </div>
              </div>
            )}

            {/* Create / Edit form */}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="prepayment-method-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="jurisdiction_id"
                  Field={Input}
                  fieldProps={{
                    label: 'Jurisdiction ID',
                    placeholder: 'e.g. 1, 2, 3',
                    type: 'number',
                  }}
                />
                <FormController
                  control={control}
                  name="method_description"
                  Field={Input}
                  fieldProps={{
                    label: 'Prepayment Method',
                    placeholder: 'e.g. Fixed, PromptTax...',
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="prepayment-method-form"
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

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Prepayment Method"
        description="Are you sure you want to delete this prepayment method? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
