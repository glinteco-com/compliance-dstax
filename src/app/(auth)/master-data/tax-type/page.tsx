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
import { useColumnTaxType } from './hooks/useColumnTaxType'
import { useTaxTypes } from './hooks/useTaxTypes'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useApiTaxComplianceTaxTypeCreate,
  useApiTaxComplianceTaxTypeUpdate,
  useApiTaxComplianceTaxTypeDestroy,
  getApiTaxComplianceTaxTypeListQueryKey,
} from '@/api/generated/tax-compliance-tax-type/tax-compliance-tax-type'
import { TaxType } from '@/models/taxType'
import { getApiErrorMessage } from '@/lib/utils'

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Must be 100 characters or less'),
})

type FormValues = z.infer<typeof formSchema>

export default function TaxTypePage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<TaxType | null>(null)

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

  const { data, isLoading } = useTaxTypes({
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
      queryKey: getApiTaxComplianceTaxTypeListQueryKey(),
    })
  }

  const { mutate: createTaxType, isPending: isCreating } =
    useApiTaxComplianceTaxTypeCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Tax type created successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to create tax type.'))
        },
      },
    })

  const { mutate: updateTaxType, isPending: isUpdating } =
    useApiTaxComplianceTaxTypeUpdate({
      mutation: {
        onSuccess: () => {
          toast.success('Tax type updated successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to update tax type.'))
        },
      },
    })

  const { mutate: deleteTaxType, isPending: isDeleting } =
    useApiTaxComplianceTaxTypeDestroy({
      mutation: {
        onSuccess: () => {
          toast.success('Tax type deleted successfully.')
          invalidateList()
          onCloseDeleteDialog()
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, 'Failed to delete tax type.'))
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: TaxType | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({ name: item.name })
    } else if (mode === 'create') {
      reset({ name: '' })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    if (drawerMode === 'create') {
      createTaxType({
        data: { name: formData.name } as any,
      })
    } else if (drawerMode === 'edit' && selectedItem) {
      updateTaxType({
        id: selectedItem.id,
        data: { name: formData.name } as any,
      })
    }
  }

  const handleDelete = (id: string) => {
    setTargetId(Number(id))
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = () => {
    if (!targetId) return
    deleteTaxType({ id: targetId })
  }

  const { columns } = useColumnTaxType({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Tax Type
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage tax types such as Sales, Sellers Use, Consumer&apos;s Use.
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
            <Plus className="mr-2 h-4 w-4" /> Add Tax Type
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No tax types found"
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
              {drawerMode === 'create' && 'Add Tax Type'}
              {drawerMode === 'edit' && 'Edit Tax Type'}
              {drawerMode === 'view' && 'Tax Type Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' && 'Enter a tax type name.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected tax type.'}
              {drawerMode === 'view' && 'Details of the selected tax type.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            {/* View mode */}
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
              </div>
            )}

            {/* Create / Edit form */}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="tax-type-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Name',
                    placeholder: 'e.g. Sales, Sellers Use, Combined',
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="tax-type-form"
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
        title="Delete Tax Type"
        description="Are you sure you want to delete this tax type? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
