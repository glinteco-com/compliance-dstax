'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormController from '@/components/form/FormController'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useColumnDstaxPreparer } from './hooks/useColumnDstaxPreparer'
import { Preparer } from '@/types/dstax-preparer'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Plus } from 'lucide-react'

const mockData: Preparer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@dstax.com',
    assignedClients: 5,
  },
  {
    id: '2',
    name: 'Bob Richards',
    email: 'bob.r@dstax.com',
    assignedClients: 3,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie.d@dstax.com',
    assignedClients: 8,
  },
]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  assignedClients: z.coerce.number().min(0, 'Must be at least 0').optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function PreparersPage() {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [targetPreparerId, setTargetPreparerId] = React.useState<string | null>(
    null
  )

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<Preparer | null>(null)

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      assignedClients: 0,
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: Preparer | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        name: item.name,
        email: item.email,
        assignedClients: item.assignedClients,
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        email: '',
        assignedClients: 0,
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setIsDrawerOpen(false)
  }

  const handleDelete = (id: string) => {
    setTargetPreparerId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetPreparerId) return
    setIsDeleting(targetPreparerId)
    // Mocking an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`Preparer ${targetPreparerId} has been deleted.`)
    setIsDeleting(null)
    onCloseDeleteDialog()
  }

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

  const { columns } = useColumnDstaxPreparer({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DSTax Preparers</h2>
          <p className="text-muted-foreground">
            Manage the list of DSTax preparers and their assignments.
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => openDrawer('create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Preparer
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No preparers found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: mockData.length,
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
              {drawerMode === 'create' && 'Add Preparer'}
              {drawerMode === 'edit' && 'Edit Preparer'}
              {drawerMode === 'view' && 'Preparer Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new preparer.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected preparer.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected preparer.'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Name</span>
                  <span className="text-zinc-600">{selectedItem.name}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Email</span>
                  <span className="text-zinc-600">{selectedItem.email}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Assigned Clients
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.assignedClients}
                  </span>
                </div>
              </div>
            )}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="preparer-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Name',
                    placeholder: 'e.g. Alice Johnson',
                  }}
                />
                <FormController
                  control={control}
                  name="email"
                  Field={Input}
                  fieldProps={{
                    label: 'Email',
                    type: 'email',
                    placeholder: 'e.g. alice.j@dstax.com',
                  }}
                />
                <FormController
                  control={control}
                  name="assignedClients"
                  Field={Input}
                  fieldProps={{
                    label: 'Assigned Clients',
                    type: 'number',
                    placeholder: 'e.g. 5',
                  }}
                />
              </form>
            )}
          </div>
          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button type="submit" form="preparer-form">
                Save changes
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
        title="Delete Preparer"
        description="Are you sure you want to delete this preparer? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={!!isDeleting}
      />
    </div>
  )
}
