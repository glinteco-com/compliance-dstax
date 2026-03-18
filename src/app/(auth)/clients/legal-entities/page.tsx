'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormController from '@/components/form/FormController'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useColumnLegalEntity } from './hooks/useColumnLegalEntity'
import { LegalEntity } from '@/types/legal-entity'
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

const mockData: LegalEntity[] = [
  {
    id: '1',
    clientName: 'Global Tech Corp',
    entityName: 'Genesis Maintenance Corporation',
    entityType: 'Corporation',
    fein: '12-3456781',
    state: 'Delaware',
  },
  {
    id: '2',
    clientName: 'Global Tech Corp',
    entityName: 'Access Direct Systems Inc',
    entityType: 'Corporation',
    fein: '12-3456782',
    state: 'New York',
  },
  {
    id: '3',
    clientName: 'Global Tech Corp',
    entityName: 'Allwork',
    entityType: 'LLC',
    fein: '12-3456783',
    state: 'California',
  },
  {
    id: '4',
    clientName: 'Global Tech Corp',
    entityName: 'Best Press',
    entityType: 'Corporation',
    fein: '12-3456784',
    state: 'Texas',
  },
  {
    id: '5',
    clientName: 'Global Tech Corp',
    entityName: 'Ussery Printing',
    entityType: 'Corporation',
    fein: '12-3456785',
    state: 'Texas',
  },
  {
    id: '6',
    clientName: 'Global Tech Corp',
    entityName: 'Blanks Printing & Imaging, Inc.',
    entityType: 'Corporation',
    fein: '12-3456786',
    state: 'Texas',
  },
  {
    id: '7',
    clientName: 'Global Tech Corp',
    entityName: 'Blevins, Inc.',
    entityType: 'Corporation',
    fein: '12-3456787',
    state: 'Tennessee',
  },
  {
    id: '8',
    clientName: 'Global Tech Corp',
    entityName: 'Carahsoft Technology',
    entityType: 'Corporation',
    fein: '12-3456788',
    state: 'Virginia',
  },
  {
    id: '9',
    clientName: 'Global Tech Corp',
    entityName: 'FedResults, Inc.',
    entityType: 'Corporation',
    fein: '12-3456789',
    state: 'Virginia',
  },
  {
    id: '10',
    clientName: 'Global Tech Corp',
    entityName: 'Carton Craft Supply',
    entityType: 'LLC',
    fein: '12-3456790',
    state: 'Illinois',
  },
  {
    id: '11',
    clientName: 'Global Tech Corp',
    entityName: 'Serviform America',
    entityType: 'LLC',
    fein: '12-3456791',
    state: 'Georgia',
  },
  {
    id: '12',
    clientName: 'Global Tech Corp',
    entityName: 'Cutlite Penta America, LLC',
    entityType: 'LLC',
    fein: '12-3456792',
    state: 'Georgia',
  },
  {
    id: '13',
    clientName: 'Global Tech Corp',
    entityName: 'CleanConnect AI',
    entityType: 'Corporation',
    fein: '12-3456793',
    state: 'Florida',
  },
  {
    id: '14',
    clientName: 'Global Tech Corp',
    entityName: 'Digital Room LLC',
    entityType: 'LLC',
    fein: '12-3456794',
    state: 'California',
  },
  {
    id: '15',
    clientName: 'Global Tech Corp',
    entityName: 'Direct Marketing Solutions',
    entityType: 'Corporation',
    fein: '12-3456795',
    state: 'Oregon',
  },
  {
    id: '16',
    clientName: 'Global Tech Corp',
    entityName: 'Dynamic Brands LLC',
    entityType: 'LLC',
    fein: '12-3456796',
    state: 'South Carolina',
  },
  {
    id: '17',
    clientName: 'Global Tech Corp',
    entityName: 'Dynamic Motion LLC',
    entityType: 'LLC',
    fein: '12-3456797',
    state: 'North Carolina',
  },
  {
    id: '18',
    clientName: 'Global Tech Corp',
    entityName: 'Simpler Postage dba EasyPost',
    entityType: 'Corporation',
    fein: '12-3456798',
    state: 'Utah',
  },
  {
    id: '19',
    clientName: 'Global Tech Corp',
    entityName: 'Echelon Fitness',
    entityType: 'Corporation',
    fein: '12-3456799',
    state: 'Tennessee',
  },
  {
    id: '20',
    clientName: 'Global Tech Corp',
    entityName: 'Echelon Holdings',
    entityType: 'Corporation',
    fein: '12-3456800',
    state: 'Tennessee',
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
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [targetEntityId, setTargetEntityId] = React.useState<string | null>(
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

  const handleDelete = (id: string) => {
    setTargetEntityId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetEntityId) return
    setIsDeleting(targetEntityId)
    // Mocking an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`Legal Entity ${targetEntityId} has been deleted.`)
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
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const { columns } = useColumnLegalEntity({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

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
        data={paginatedData}
        emptyMessage="No legal entities found"
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

      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Legal Entity"
        description="Are you sure you want to delete this legal entity? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={!!isDeleting}
      />
    </div>
  )
}
