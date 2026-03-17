'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import { Plus, Edit2, Trash2, Key, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
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

interface User {
  id: string
  clientName: string
  name: string
  username: string
  password?: string
  role: string
}

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
    setIsResetting(id)
    // Mocking an async operation
    setTimeout(() => {
      alert(`Password reset for user ${id}. A reset link has been sent.`)
      setIsResetting(null)
    }, 1000)
  }

  const columns: Column<User>[] = [
    {
      id: 'clientName',
      label: 'Client Name',
      render: (item) => (
        <span className="font-medium text-zinc-900">{item.clientName}</span>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      render: (item) => <span>{item.name}</span>,
    },
    {
      id: 'username',
      label: 'Username',
      render: (item) => (
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
          {item.username}
        </code>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      render: (item) => (
        <span className="font-mono tracking-widest text-zinc-400">
          {item.password}
        </span>
      ),
    },
    {
      id: 'role',
      label: 'User Role',
      render: (item) => (
        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-700/10 ring-inset dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10">
          {item.role}
        </span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 180,
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <CommonTooltip content="View Details">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
              onClick={() => openDrawer('view', item)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Edit">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
              onClick={() => openDrawer('edit', item)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Reset Password">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
              onClick={() => handleResetPassword(item.id)}
            >
              <Key className="h-4 w-4" />
              <span className="sr-only">Reset Password</span>
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Delete">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CommonTooltip>
        </div>
      ),
    },
  ]

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
        data={mockData}
        emptyMessage="No users found"
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
    </div>
  )
}
