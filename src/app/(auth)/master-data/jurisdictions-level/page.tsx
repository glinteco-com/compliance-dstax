'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
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
import { useColumnJurisdictionLevel } from './hooks/useColumnJurisdictionLevel'
import { useJurisdictionLevels } from './hooks/useJurisdictionLevels'
import { JurisdictionLevel as GeneratedJurisdictionLevel } from '@/models/jurisdictionLevel'

export type JurisdictionLevel = GeneratedJurisdictionLevel & {
  description?: string
}
import { useDebounce } from '@/hooks/useDebounce'

const formSchema = z.object({
  name: z.string().min(1, 'Level name is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function JurisdictionLevelPage() {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [targetId, setTargetId] = React.useState<string | null>(null)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] =
    React.useState<JurisdictionLevel | null>(null)

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const { data, isLoading } = useJurisdictionLevels({
    page: currentPage,
    pageSize,
    search: search || undefined,
  })

  const paginatedData = data?.results ?? []
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: JurisdictionLevel | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({ name: item.name, description: item.description ?? '' })
    } else if (mode === 'create') {
      reset({ name: '', description: '' })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
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
    console.log(`Jurisdiction Level ${targetId} has been deleted.`)
    setIsDeleting(false)
    onCloseDeleteDialog()
  }

  const { columns } = useColumnJurisdictionLevel({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jurisdiction Level
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage jurisdiction levels such as Country, State, and Local.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            onClick={() => openDrawer('create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Level
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No jurisdiction levels found"
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: data?.count ?? 0,
        }}
      />

      {/* Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {drawerMode === 'create' && 'Add Jurisdiction Level'}
              {drawerMode === 'edit' && 'Edit Jurisdiction Level'}
              {drawerMode === 'view' && 'Jurisdiction Level Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Enter the details of the new jurisdiction level.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected jurisdiction level.'}
              {drawerMode === 'view' &&
                'Details of the selected jurisdiction level.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Level Name
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.name}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Description
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedItem.description ?? '—'}
                  </span>
                </div>
              </div>
            )}

            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="jurisdiction-level-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Level Name',
                    placeholder: 'e.g. Country',
                  }}
                />
                <FormController
                  control={control}
                  name="description"
                  Field={Input}
                  fieldProps={{
                    label: 'Description',
                    placeholder: 'e.g. Top-level national jurisdiction',
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button type="submit" form="jurisdiction-level-form">
                Save changes
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Jurisdiction Level"
        description="Are you sure you want to delete this jurisdiction level? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
