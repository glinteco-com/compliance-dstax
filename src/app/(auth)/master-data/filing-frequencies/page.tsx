'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
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
import { useColumnFilingFrequency } from './hooks/useColumnFilingFrequency'
import { FilingFrequency } from '@/types/filing-frequency'

const mockData: FilingFrequency[] = [
  {
    id: '1',
    type: 'M',
    description: 'Monthly',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    type: 'W',
    description: 'Weekly',
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    type: 'Q',
    description: 'Quarterly',
    createdAt: '2026-01-15',
  },
  {
    id: '4',
    type: 'A',
    description: 'Annual',
    createdAt: '2026-01-15',
  },
  {
    id: '5',
    type: 'SA',
    description: 'Semi-Annual',
    createdAt: '2026-02-01',
  },
  {
    id: '6',
    type: 'D',
    description: 'Daily',
    createdAt: '2026-02-01',
  },
]

const formSchema = z.object({
  type: z
    .string()
    .min(1, 'Type is required')
    .max(5, 'Type must be 5 characters or fewer')
    .toUpperCase(),
  description: z.string().min(1, 'Description is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function FilingFrequenciesPage() {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [targetId, setTargetId] = React.useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

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
    defaultValues: { type: '', description: '' },
  })

  const openDrawer = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    reset({ type: '', description: '' })
    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('New filing frequency:', data)
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
    console.log(`Filing Frequency ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnFilingFrequency({
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Filing Frequencies
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage filing frequency types such as Monthly, Weekly, and
            Quarterly.
          </p>
        </div>
        <Button
          className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={openDrawer}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Frequency
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No filing frequencies found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: mockData.length,
        }}
      />

      {/* Create Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Filing Frequency</DrawerTitle>
            <DrawerDescription>
              Enter a short type code and its full description.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            <form
              id="filing-frequency-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-4"
            >
              <FormController
                control={control}
                name="type"
                Field={Input}
                fieldProps={{
                  label: 'Type',
                  placeholder: 'e.g. M, W, Q',
                  maxLength: 5,
                }}
              />
              <FormController
                control={control}
                name="description"
                Field={Input}
                fieldProps={{
                  label: 'Description',
                  placeholder: 'e.g. Monthly',
                }}
              />
            </form>
          </div>

          <DrawerFooter>
            <Button type="submit" form="filing-frequency-form">
              Save
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Filing Frequency"
        description="Are you sure you want to delete this filing frequency? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
