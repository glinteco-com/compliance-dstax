'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import { Plus } from 'lucide-react'
import FormController from '@/components/form/FormController'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useColumnClientUser } from './hooks/useColumnClientUser'
import { User } from '@/types/user'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

const mockData: User[] = [
  {
    id: '1',
    clientName: 'Global Tech Corp',
    name: 'Emily Smith',
    username: 'esmith',
    password: '••••••••',
    role: 'Admin',
  },
  {
    id: '2',
    clientName: 'Global Tech Corp',
    name: 'Josh Miller',
    username: 'jmiller',
    password: '••••••••',
    role: 'Viewer',
  },
  {
    id: '3',
    clientName: 'Eco Solutions Ltd',
    name: 'Sarah Lee',
    username: 'slee',
    password: '••••••••',
    role: 'Editor',
  },
]

const formSchema = z.object({
  clientName: z.string().min(1, 'Client Name is required'),
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function UsersPage() {
  const [isResetting, setIsResetting] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

  const {
    isOpenDialog: isOpenResetDialog,
    onOpenDialog: onOpenResetDialog,
    onCloseDialog: onCloseResetDialog,
    setIsOpenDialog: setIsOpenResetDialog,
  } = useDialog()

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [targetUserId, setTargetUserId] = React.useState<string | null>(null)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<User | null>(null)

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      name: '',
      username: '',
      password: '',
      role: '',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: User | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        clientName: item.clientName,
        name: item.name,
        username: item.username,
        password: item.password || '',
        role: item.role,
      })
    } else if (mode === 'create') {
      reset({
        clientName: '',
        name: '',
        username: '',
        password: '',
        role: '',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setIsDrawerOpen(false)
  }

  const handleResetPassword = (id: string) => {
    setTargetUserId(id)
    onOpenResetDialog()
  }

  const handleConfirmResetPassword = async () => {
    if (!targetUserId) return
    setIsResetting(targetUserId)
    // Mocking an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(
      `Password reset for user ${targetUserId}. A reset link has been sent.`
    )
    setIsResetting(null)
    onCloseResetDialog()
  }

  const handleDelete = (id: string) => {
    setTargetUserId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetUserId) return
    setIsDeleting(targetUserId)
    // Mocking an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`User ${targetUserId} has been deleted.`)
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

  const { columns } = useColumnClientUser({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onResetPassword: handleResetPassword,
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage users for each client and their access roles.
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => openDrawer('create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No users found"
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
              {drawerMode === 'create' && 'Add User'}
              {drawerMode === 'edit' && 'Edit User'}
              {drawerMode === 'view' && 'User Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' && 'Enter the details of the new user.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected user.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected user.'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Client Name
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.clientName}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Name</span>
                  <span className="text-zinc-600">{selectedItem.name}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Username</span>
                  <span className="text-zinc-600">{selectedItem.username}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Password</span>
                  <span className="text-zinc-600">{selectedItem.password}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Role</span>
                  <span className="text-zinc-600">{selectedItem.role}</span>
                </div>
              </div>
            )}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="user-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="clientName"
                  Field={Input}
                  fieldProps={{
                    label: 'Client Name',
                    placeholder: 'e.g. Global Tech Corp',
                  }}
                />
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Name',
                    placeholder: 'e.g. Emily Smith',
                  }}
                />
                <FormController
                  control={control}
                  name="username"
                  Field={Input}
                  fieldProps={{ label: 'Username', placeholder: 'e.g. esmith' }}
                />
                {drawerMode === 'create' && (
                  <FormController
                    control={control}
                    name="password"
                    Field={PasswordInput}
                    fieldProps={{
                      label: 'Password',
                      placeholder: 'Enter password',
                    }}
                  />
                )}
                <FormController
                  control={control}
                  name="role"
                  Field={Input}
                  fieldProps={{ label: 'Role', placeholder: 'e.g. Admin' }}
                />
              </form>
            )}
          </div>
          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button type="submit" form="user-form">
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
        isOpen={isOpenResetDialog}
        onOpenChange={setIsOpenResetDialog}
        title="Reset Password"
        description="Are you sure you want to reset the password for this user? A reset link will be sent to their email."
        confirmText="Reset"
        onConfirm={handleConfirmResetPassword}
        isLoading={!!isResetting}
      />

      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={!!isDeleting}
      />
    </div>
  )
}
