'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Plus, Edit2, Trash2, Eye } from 'lucide-react'
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

interface LegalEntity {
  id: string
  clientName: string
  entityName: string
  entityType: string
  fein: string
  state: string
}

const mockData: LegalEntity[] = [
  {
    id: '1',
    clientName: 'Global Tech Corp',
    entityName: 'Global Tech US Inc',
    entityType: 'Corporation',
    fein: '12-3456789',
    state: 'Delaware',
  },
  {
    id: '2',
    clientName: 'Global Tech Corp',
    entityName: 'Global Tech West LLC',
    entityType: 'LLC',
    fein: '98-7654321',
    state: 'California',
  },
  {
    id: '3',
    clientName: 'Eco Solutions Ltd',
    entityName: 'Eco Solutions US',
    entityType: 'Corporation',
    fein: '45-6789012',
    state: 'Texas',
  },
]

const formSchema = z.object({
  clientName: z.string().min(1, 'Client Name is required'),
  entityName: z.string().min(1, 'Legal Entity Name is required'),
  entityType: z.string().min(1, 'Entity Type is required'),
  fein: z.string().min(1, 'FEIN is required'),
  state: z.string().min(1, 'State is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function LegalEntitiesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] = React.useState<LegalEntity | null>(
    null
  )

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      entityName: '',
      entityType: '',
      fein: '',
      state: '',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: LegalEntity | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        clientName: item.clientName,
        entityName: item.entityName,
        entityType: item.entityType,
        fein: item.fein,
        state: item.state,
      })
    } else if (mode === 'create') {
      reset({
        clientName: '',
        entityName: '',
        entityType: '',
        fein: '',
        state: '',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setIsDrawerOpen(false)
  }

  const columns: Column<LegalEntity>[] = [
    {
      id: 'clientName',
      label: 'Client Name',
      render: (item) => (
        <span className="font-medium text-zinc-900">{item.clientName}</span>
      ),
    },
    {
      id: 'entityName',
      label: 'Legal Entity Name',
      render: (item) => <span>{item.entityName}</span>,
    },
    {
      id: 'entityType',
      label: 'Entity Type',
      render: (item) => <span>{item.entityType}</span>,
    },
    {
      id: 'fein',
      label: 'FEIN',
      render: (item) => <code className="text-xs">{item.fein}</code>,
    },
    {
      id: 'state',
      label: 'State',
      render: (item) => <span>{item.state}</span>,
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
          <h2 className="text-2xl font-bold tracking-tight">Legal Entities</h2>
          <p className="text-muted-foreground">
            Manage legal entities associated with your clients.
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => openDrawer('create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Legal Entity
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={mockData}
        emptyMessage="No legal entities found"
      />

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {drawerMode === 'create' && 'Add Legal Entity'}
              {drawerMode === 'edit' && 'Edit Legal Entity'}
              {drawerMode === 'view' && 'Legal Entity Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new legal entity.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected legal entity.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected legal entity.'}
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
                  <span className="font-semibold text-zinc-900">
                    Legal Entity Name
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.entityName}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Entity Type
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.entityType}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">FEIN</span>
                  <span className="text-zinc-600">{selectedItem.fein}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">State</span>
                  <span className="text-zinc-600">{selectedItem.state}</span>
                </div>
              </div>
            )}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="legal-entity-form"
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
                  name="entityName"
                  Field={Input}
                  fieldProps={{
                    label: 'Legal Entity Name',
                    placeholder: 'e.g. Global Tech US Inc',
                  }}
                />
                <FormController
                  control={control}
                  name="entityType"
                  Field={Input}
                  fieldProps={{
                    label: 'Entity Type',
                    placeholder: 'e.g. Corporation',
                  }}
                />
                <FormController
                  control={control}
                  name="fein"
                  Field={Input}
                  fieldProps={{ label: 'FEIN', placeholder: 'e.g. 12-3456789' }}
                />
                <FormController
                  control={control}
                  name="state"
                  Field={Input}
                  fieldProps={{ label: 'State', placeholder: 'e.g. Delaware' }}
                />
              </form>
            )}
          </div>
          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button type="submit" form="legal-entity-form">
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
