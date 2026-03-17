'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Mail, Eye } from 'lucide-react'
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

interface Preparer {
  id: string
  name: string
  email: string
  assignedClients: number
}

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

  const columns: Column<Preparer>[] = [
    {
      id: 'name',
      label: 'Name',
      render: (item) => (
        <span className="font-medium text-zinc-900">{item.name}</span>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      render: (item) => (
        <a
          href={`mailto:${item.email}`}
          className="inline-flex items-center text-zinc-600 hover:text-zinc-900"
        >
          <Mail className="mr-2 h-4 w-4" />
          {item.email}
        </a>
      ),
    },
    {
      id: 'assignedClients',
      label: 'Assigned Clients',
      render: (item) => (
        <span className="text-zinc-600">{item.assignedClients}</span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 140,
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
        data={mockData}
        emptyMessage="No preparers found"
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
    </div>
  )
}
