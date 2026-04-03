'use client'

import * as React from 'react'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { CommonSelect } from '@/components/select/CommonSelect'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormController from '@/components/form/FormController'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  useSupportTickets,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
} from './hooks/useSupportTickets'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import { useColumnSupportTicket } from './hooks/useColumnSupportTicket'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'
import { Ticket } from '@/types/support-ticket'
import { useSessionStore } from '@/store/useSessionStore'

const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  client_id: z.coerce.number().nullable().optional(),
  legal_entity_id: z.coerce.number().nullable().optional(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

export default function SupportTicketsPage() {
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null)
  const [targetTicketId, setTargetTicketId] = React.useState<number | null>(
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
  const [selectedItem, setSelectedItem] = React.useState<Ticket | null>(null)

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      client_id: null,
      legal_entity_id: null,
    },
  })

  const createTicketMutation = useCreateTicket()
  const updateTicketMutation = useUpdateTicket()
  const deleteTicketMutation = useDeleteTicket()

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: Ticket | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        title: item.title,
        description: item.description,
        client_id: item.client_id ?? item.client?.id ?? null,
        legal_entity_id: item.legal_entity_id ?? item.legal_entity?.id ?? null,
      })
    } else if (mode === 'create') {
      reset({
        title: '',
        description: '',
        client_id: null,
        legal_entity_id: null,
      })
    }
    setIsDrawerOpen(true)
  }

  const onSubmit = async (data: TicketFormValues) => {
    if (drawerMode === 'create') {
      await createTicketMutation.mutateAsync({ data })
    } else if (drawerMode === 'edit' && selectedItem) {
      await updateTicketMutation.mutateAsync({ id: selectedItem.id, data })
    }
    setIsDrawerOpen(false)
  }

  const handleDelete = (id: number) => {
    setTargetTicketId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetTicketId) return
    setIsDeleting(targetTicketId)
    await deleteTicketMutation.mutateAsync({ id: targetTicketId })
    setIsDeleting(null)
    onCloseDeleteDialog()
  }

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const [priority, setPriority] = React.useState<any>('all')

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const { user } = useSessionStore()

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, priority, user?.id])

  const { data: clientData } = useApiCoreClientList()
  const clientOptions = (clientData?.results ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const { data: legalEntityData } = useApiCoreLegalEntityList()
  const legalEntityOptions = (legalEntityData?.results ?? []).map((le) => ({
    value: le.id,
    label: le.name,
  }))

  const { data, isLoading } = useSupportTickets({
    page: currentPage,
    pageSize,
    search: search || undefined,
    created_by: user?.id,
  })

  const paginatedData = data?.results ?? []
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const { columns } = useColumnSupportTicket({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: (id) => handleDelete(id),
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">
            Manage and respond to user support requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CommonSelect
            placeholder="All Priorities"
            value={priority}
            onChange={(val) =>
              setPriority(val as 'low' | 'normal' | 'high' | 'all')
            }
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
            ]}
            className="w-40"
          />
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
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => openDrawer('create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Ticket
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No tickets found"
        isLoading={isLoading}
        onRowClick={(item) => openDrawer('view', item)}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSize,
          totalItems: data?.count ?? 0,
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
              {drawerMode === 'create' && 'Create New Ticket'}
              {drawerMode === 'edit' && `Edit Ticket: ${selectedItem?.id}`}
              {drawerMode === 'view' && `Ticket Details: ${selectedItem?.id}`}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' &&
                'Fill in the details to create a new support ticket.'}
              {drawerMode === 'edit' &&
                'Update the details of the selected ticket.'}
              {drawerMode === 'view' &&
                'Here are the details of the selected ticket.'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">ID</span>
                  <span className="text-zinc-600">{selectedItem.id}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Title</span>
                  <span className="text-zinc-600">{selectedItem.title}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Description
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.description}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Client</span>
                  <span className="text-zinc-600">
                    {selectedItem.client?.name ?? '-'}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Legal Entity
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.legal_entity?.name ?? '-'}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">
                    Created By
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.created_by?.email ?? '-'}
                  </span>
                </div>
              </div>
            )}
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="ticket-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="title"
                  Field={Input}
                  fieldProps={{
                    label: 'Support Issue Title',
                    placeholder: 'Summarize your issue',
                  }}
                />
                <FormController
                  control={control}
                  name="description"
                  Field={Textarea}
                  fieldProps={{
                    label: 'Description',
                    placeholder: 'Enter a detailed description',
                    rows: 6,
                  }}
                />
                <FormController
                  control={control}
                  name="client_id"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Client',
                    placeholder: 'Select client',
                    options: clientOptions,
                  }}
                />
                <FormController
                  control={control}
                  name="legal_entity_id"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Legal Entity',
                    placeholder: 'Select legal entity',
                    options: legalEntityOptions,
                  }}
                />
              </form>
            )}
          </div>
          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button type="submit" form="ticket-form" isLoading={isSubmitting}>
                Save Changes
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
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={!!isDeleting}
      />
    </div>
  )
}
