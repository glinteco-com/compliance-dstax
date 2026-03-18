'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputDatePicker } from '@/components/date-picker/date-picker'
import { Plus } from 'lucide-react'
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
import { Jurisdiction, JurisdictionLevel } from '@/types/jurisdictions'

const mockData: Jurisdiction[] = [
  {
    id: '1',
    name: 'Alabama',
    level: 'State',
    dueDate: '2026-04-20',
    dueDateTime: '17:00',
  },
  {
    id: '2',
    name: 'California',
    level: 'State',
    dueDate: '2026-04-30',
    dueDateTime: '23:59',
  },
  {
    id: '3',
    name: 'United States',
    level: 'Country',
    dueDate: '2026-04-15',
    dueDateTime: '12:00',
  },
  {
    id: '4',
    name: 'Los Angeles',
    level: 'Local',
    dueDate: '2026-05-10',
    dueDateTime: '18:00',
  },
  {
    id: '5',
    name: 'Texas',
    level: 'State',
    dueDate: '2026-05-20',
    dueDateTime: '17:00',
  },
  {
    id: '6',
    name: 'New York',
    level: 'State',
    dueDate: '2026-05-30',
    dueDateTime: '23:59',
  },
  {
    id: '7',
    name: 'Chicago',
    level: 'Local',
    dueDate: '2026-06-15',
    dueDateTime: '16:00',
  },
  {
    id: '8',
    name: 'Canada',
    level: 'Country',
    dueDate: '2026-06-30',
    dueDateTime: '23:59',
  },
  {
    id: '9',
    name: 'Florida',
    level: 'State',
    dueDate: '2026-07-20',
    dueDateTime: '17:00',
  },
  {
    id: '10',
    name: 'Seattle',
    level: 'Local',
    dueDate: '2026-07-31',
    dueDateTime: '23:59',
  },
  {
    id: '11',
    name: 'Georgia',
    level: 'State',
    dueDate: '2026-08-20',
    dueDateTime: '17:00',
  },
  {
    id: '12',
    name: 'Ohio',
    level: 'State',
    dueDate: '2026-08-30',
    dueDateTime: '23:59',
  },
]

const LEVEL_OPTIONS: JurisdictionLevel[] = ['Country', 'State', 'Local']

const formSchema = z.object({
  name: z.string().min(1, 'Jurisdiction name is required'),
  level: z.enum(['Country', 'State', 'Local'], {
    required_error: 'Level is required',
  }),
  dueDate: z.string().min(1, 'Due date is required'),
  dueDateTime: z.string().min(1, 'Due date time is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function JurisdictionsPage() {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [targetId, setTargetId] = React.useState<string | null>(null)

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

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const totalPages = Math.ceil(mockData.length / pageSize)

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return mockData.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize])

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      level: undefined,
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
        level: item.level,
        dueDate: item.dueDate,
        dueDateTime: item.dueDateTime,
      })
    } else if (mode === 'create') {
      reset({ name: '', level: undefined, dueDate: '', dueDateTime: '' })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setIsDrawerOpen(false)
  }

  const handleDelete = (id: string) => {
    setTargetId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetId) return
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Jurisdiction ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnJurisdiction({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jurisdictions
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage jurisdictions including Countries, States, and Localities.
          </p>
        </div>
        <Button
          className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={() => openDrawer('create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Jurisdiction
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No jurisdictions found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: mockData.length,
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
                    {selectedItem.level}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Due Date
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.dueDate}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Due Date Time
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.dueDateTime}
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
                    options: LEVEL_OPTIONS.map((l) => ({ value: l, label: l })),
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
              <Button type="submit" form="jurisdiction-form">
                Save changes
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Confirm Delete Dialog */}
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
