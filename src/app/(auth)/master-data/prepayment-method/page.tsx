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
import { useColumnPrepaymentMethod } from './hooks/useColumnPrepaymentMethod'
import { PrepaymentMethod } from '@/types/prepayment-method'

const mockData: PrepaymentMethod[] = [
  {
    id: '1',
    state: 'FL',
    method: 'Fixed',
  },
  {
    id: '2',
    state: 'OK',
    method: '50% of same month prior year',
  },
  {
    id: '3',
    state: 'OH',
    method: '75% of current month',
  },
  {
    id: '4',
    state: 'NY',
    method: 'PromptTax',
  },
]

const formSchema = z.object({
  state: z
    .string()
    .min(1, 'State is required')
    .max(2, 'State must be a 2-letter code')
    .toUpperCase(),
  method: z.string().min(1, 'Prepayment Method is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function PrepaymentMethodPage() {
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
    defaultValues: { state: '', method: '' },
  })

  const openDrawer = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    reset({ state: '', method: '' })
    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('New prepayment method:', data)
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
    console.log(`Prepayment Method ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnPrepaymentMethod({
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Prepayment Method
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage prepayment methods for each state.
          </p>
        </div>
        <Button
          className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={openDrawer}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Method
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No prepayment methods found"
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
            <DrawerTitle>Add Prepayment Method</DrawerTitle>
            <DrawerDescription>
              Enter a state code and its corresponding prepayment method.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            <form
              id="prepayment-method-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-4"
            >
              <FormController
                control={control}
                name="state"
                Field={Input}
                fieldProps={{
                  label: 'State',
                  placeholder: 'e.g. FL, OK, OH, NY',
                  maxLength: 2,
                }}
              />
              <FormController
                control={control}
                name="method"
                Field={Input}
                fieldProps={{
                  label: 'Prepayment Method',
                  placeholder: 'e.g. Fixed, PromptTax...',
                }}
              />
            </form>
          </div>

          <DrawerFooter>
            <Button type="submit" form="prepayment-method-form">
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
        title="Delete Prepayment Method"
        description="Are you sure you want to delete this prepayment method? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
