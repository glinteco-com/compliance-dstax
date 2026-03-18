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
import { useColumnTaxType } from './hooks/useColumnTaxType'
import { TaxType } from '@/types/tax-type'

const mockData: TaxType[] = [
  {
    id: '1',
    type: 'Sales',
    description: 'General sales tax',
  },
  {
    id: '2',
    type: 'Sellers Use',
    description: 'Use tax collected by sellers',
  },
  {
    id: '3',
    type: "Consumer's Use",
    description: 'Use tax paid by consumers',
  },
  {
    id: '4',
    type: 'Combined',
    description: 'Combined sales and use tax',
  },
  {
    id: '5',
    type: 'CAT',
    description: 'Commercial Activity Tax',
  },
]

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function TaxTypePage() {
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
    console.log('New tax type:', data)
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
    console.log(`Tax Type ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnTaxType({
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Tax Type
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage tax types such as Sales, Sellers Use, Consumer&apos;s Use.
          </p>
        </div>
        <Button
          className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={openDrawer}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Tax Type
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No tax types found"
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
            <DrawerTitle>Add Tax Type</DrawerTitle>
            <DrawerDescription>
              Enter a tax type name and its description.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            <form
              id="tax-type-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-4"
            >
              <FormController
                control={control}
                name="type"
                Field={Input}
                fieldProps={{
                  label: 'Type',
                  placeholder: 'e.g. Sales, Sellers Use, Combined',
                }}
              />
              <FormController
                control={control}
                name="description"
                Field={Input}
                fieldProps={{
                  label: 'Description',
                  placeholder: 'e.g. General sales tax',
                }}
              />
            </form>
          </div>

          <DrawerFooter>
            <Button type="submit" form="tax-type-form">
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
        title="Delete Tax Type"
        description="Are you sure you want to delete this tax type? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
