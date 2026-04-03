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
import { InputDatePicker } from '@/components/date-picker/date-picker'
import { Plus, Search } from 'lucide-react'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import FormController from '@/components/form/FormController'
import { CommonSelect } from '@/components/select/CommonSelect'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useColumnJurisdiction } from './hooks/useColumnJurisdiction'
import { useJurisdictions } from './hooks/useJurisdictions'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useApiTaxComplianceJurisdictionCreate,
  useApiTaxComplianceJurisdictionUpdate,
  useApiTaxComplianceJurisdictionDestroy,
  getApiTaxComplianceJurisdictionListQueryKey,
} from '@/api/generated/tax-compliance-jurisdiction/tax-compliance-jurisdiction'
import { Jurisdiction } from '@/models/jurisdiction'
import { useJurisdictionLevels } from '../jurisdictions-level/hooks/useJurisdictionLevels'
import { getApiErrorMessage } from '@/lib/utils'

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Jurisdiction name is required')
    .max(255, 'Must be 255 characters or less'),
  level: z.string().min(1, 'Level is required'),
  dueDate: z.string().optional(),
  dueDateTime: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function JurisdictionsPage() {
  const queryClient = useQueryClient()

  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<Jurisdiction | null>(
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

  const { data, isLoading } = useJurisdictions({
    page: currentPage,
    pageSize,
    search: search || undefined,
  })

  const { data: levelsData } = useJurisdictionLevels({
    page: 1,
    pageSize: 100,
  })

  const levelOptions = (levelsData?.results ?? []).map((l) => ({
    value: String(l.id),
    label: l.name,
  }))

  const paginatedData = data?.results ?? []
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: getApiTaxComplianceJurisdictionListQueryKey(),
    })
  }

  const { mutate: createJurisdiction, isPending: isCreating } =
    useApiTaxComplianceJurisdictionCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Jurisdiction created successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to create jurisdiction.')
          )
        },
      },
    })

  const { mutate: updateJurisdiction, isPending: isUpdating } =
    useApiTaxComplianceJurisdictionUpdate({
      mutation: {
        onSuccess: () => {
          toast.success('Jurisdiction updated successfully.')
          invalidateList()
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to update jurisdiction.')
          )
        },
      },
    })

  const { mutate: deleteJurisdiction, isPending: isDeleting } =
    useApiTaxComplianceJurisdictionDestroy({
      mutation: {
        onSuccess: () => {
          toast.success('Jurisdiction deleted successfully.')
          invalidateList()
          onCloseDeleteDialog()
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to delete jurisdiction.')
          )
        },
      },
    })

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      level: '',
      dueDate: '',
      dueDateTime: '',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: Jurisdiction | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        name: item.name,
        level: String(item.level),
        dueDate: item.due_date_time?.split('T')[0] || '',
        dueDateTime: item.due_date_time?.split('T')[1]?.substring(0, 5) || '',
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        level: '',
        dueDate: '',
        dueDateTime: '',
      })
    }

    setIsDrawerOpen(true)
  }

  const buildDueDateTime = (dueDate?: string, dueDateTime?: string) => {
    if (!dueDate) return null
    if (dueDateTime) return `${dueDate}T${dueDateTime}:00Z`
    return `${dueDate}T00:00:00Z`
  }

  const onSubmit = (formData: FormValues) => {
    const payload = {
      name: formData.name,
      level: Number(formData.level),
      due_date_time: buildDueDateTime(formData.dueDate, formData.dueDateTime),
    }

    if (drawerMode === 'create') {
      createJurisdiction({ data: payload as any })
    } else if (drawerMode === 'edit' && selectedItem) {
      updateJurisdiction({
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
    deleteJurisdiction({ id: targetId })
  }

  const { columns } = useColumnJurisdiction({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jurisdictions
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage jurisdictions including Countries, States, and Localities.
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
            <Plus className="mr-2 h-4 w-4" /> Add Jurisdiction
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No jurisdictions found"
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
              {drawerMode === 'create' && 'Add Jurisdiction'}
              {drawerMode === 'edit' && 'Edit Jurisdiction'}
              {drawerMode === 'view' && 'Jurisdiction Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new jurisdiction.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected jurisdiction.'}
              {drawerMode === 'view' && 'Details of the selected jurisdiction.'}
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
                    Jurisdiction Name
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.name}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Level
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.level_name}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Due Date
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.due_date_time?.split('T')[0] || '-'}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Due Date Time
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.due_date_time
                      ?.split('T')[1]
                      ?.substring(0, 5) || '-'}
                  </span>
                </div>
              </div>
            )}

            {/* Create / Edit form */}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="jurisdiction-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Jurisdiction Name',
                    placeholder: 'e.g. California',
                  }}
                />

                <FormController
                  control={control}
                  name="level"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Level',
                    placeholder: 'Select a level',
                    options: levelOptions,
                  }}
                />

                <FormController
                  control={control}
                  name="dueDate"
                  Field={InputDatePicker}
                  fieldProps={{
                    label: 'Due Date',
                    placeholder: 'Select due date',
                  }}
                />

                <FormController
                  control={control}
                  name="dueDateTime"
                  Field={Input}
                  fieldProps={{
                    label: 'Due Date Time',
                    type: 'time',
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="jurisdiction-form"
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
        title="Delete Jurisdiction"
        description="Are you sure you want to delete this jurisdiction? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
