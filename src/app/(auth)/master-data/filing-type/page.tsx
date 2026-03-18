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
import { useColumnFilingType } from './hooks/useColumnFilingType'
import { FilingType } from '@/types/filing-type'

const mockData: FilingType[] = [
  {
    id: '1',
    type: 'E-File',
    description: 'Electronic filing via online portal',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    type: 'Mail',
    description: 'Paper filing via postal mail',
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    type: 'In-Person',
    description: 'Filing submitted in person at the office',
    createdAt: '2026-01-15',
  },
  {
    id: '4',
    type: 'Fax',
    description: 'Filing submitted via fax',
    createdAt: '2026-01-15',
  },
  {
    id: '5',
    type: 'EDI',
    description: 'Electronic Data Interchange filing',
    createdAt: '2026-02-01',
  },
]

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function FilingTypePage() {
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
    console.log('New filing type:', data)
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
    console.log(`Filing Type ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnFilingType({
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Filing Type
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage filing types such as E-File, Mail, and In-Person.
          </p>
        </div>
        <Button
          className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={openDrawer}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Filing Type
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No filing types found"
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
            <DrawerTitle>Add Filing Type</DrawerTitle>
            <DrawerDescription>
              Enter a filing type name and its description.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            <form
              id="filing-type-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-4"
            >
              <FormController
                control={control}
                name="type"
                Field={Input}
                fieldProps={{
                  label: 'Type',
                  placeholder: 'e.g. E-File, Mail, In-Person',
                }}
              />
              <FormController
                control={control}
                name="description"
                Field={Input}
                fieldProps={{
                  label: 'Description',
                  placeholder: 'e.g. Electronic filing via online portal',
                }}
              />
            </form>
          </div>

          <DrawerFooter>
            <Button type="submit" form="filing-type-form">
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
        title="Delete Filing Type"
        description="Are you sure you want to delete this filing type? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
