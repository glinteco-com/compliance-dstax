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
import { InputDatePicker } from '@/components/date-picker/date-picker'
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
import { useColumnSupportTicket } from './hooks/useColumnSupportTicket'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'
import { Ticket } from '@/types/support-ticket'

const ticketSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  summary: z.string().min(1, 'Summary is required'),
  createdDate: z.string().min(1, 'Create date is required'),
  priority: z.enum(['low', 'normal', 'high']),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
})

type TicketFormValues = z.infer<typeof ticketSchema>

export default function SupportTicketsPage() {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [targetTicketId, setTargetTicketId] = React.useState<string | null>(
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
      name: '',
      summary: '',
      createdDate: new Date().toISOString().split('T')[0],
      priority: 'low',
      description: '',
      dueDate: '',
      email: '',
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
        name: item.name,
        summary: item.summary || '',
        createdDate: item.createdDate,
        priority: item.priority,
        description: item.description || '',
        dueDate: item.dueDate || '',
        email: item.email || '',
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        summary: '',
        createdDate: new Date().toISOString().split('T')[0],
        priority: 'low',
        description: '',
        dueDate: '',
        email: '',
      })
    }
    setIsDrawerOpen(true)
  }

  const onSubmit = async (data: TicketFormValues) => {
    if (drawerMode === 'create') {
      await createTicketMutation.mutateAsync(data)
    } else if (drawerMode === 'edit' && selectedItem) {
      await updateTicketMutation.mutateAsync({ ...data, id: selectedItem.id })
    }
    setIsDrawerOpen(false)
  }

  const handleDelete = (id: string) => {
    setTargetTicketId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = async () => {
    if (!targetTicketId) return
    setIsDeleting(targetTicketId)
    await deleteTicketMutation.mutateAsync(targetTicketId)
    setIsDeleting(null)
    onCloseDeleteDialog()
  }

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const [priority, setPriority] = React.useState<
    'low' | 'normal' | 'high' | 'all'
  >('all')

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, priority])

  const { data, isLoading } = useSupportTickets({
    page: currentPage,
    pageSize,
    search: search || undefined,
    priority: priority !== 'all' ? priority : undefined,
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
    onDelete: handleDelete,
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
                  <span className="font-semibold text-zinc-900">
                    Created Date
                  </span>
                  <span className="text-zinc-600">
                    {selectedItem.createdDate}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Name</span>
                  <span className="text-zinc-600">{selectedItem.name}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Summary</span>
                  <span className="text-zinc-600">{selectedItem.summary}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Priority</span>
                  <span className="text-zinc-600">{selectedItem.priority}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold text-zinc-900">Email</span>
                  <span className="text-zinc-600">{selectedItem.email}</span>
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
                  <span className="font-semibold text-zinc-900">Due Date</span>
                  <span className="text-zinc-600">{selectedItem.dueDate}</span>
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
                  name="name"
                  Field={Input}
                  fieldProps={{
                    label: 'Ticket Name',
                    placeholder: 'Enter ticket name',
                  }}
                />
                <FormController
                  control={control}
                  name="summary"
                  Field={Input}
                  fieldProps={{
                    label: 'Summary of the Problem',
                    placeholder: 'Brief summary',
                  }}
                />
                <FormController
                  control={control}
                  name="createdDate"
                  Field={InputDatePicker}
                  fieldProps={{
                    label: 'Create Date',
                    disabled: true,
                  }}
                />
                <FormController
                  control={control}
                  name="priority"
                  Field={CommonSelect}
                  fieldProps={{
                    label: 'Priority',
                    placeholder: 'Select priority',
                    options: [
                      { value: 'low', label: 'Low' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'high', label: 'High' },
                    ],
                  }}
                />
                <FormController
                  control={control}
                  name="email"
                  Field={Input}
                  fieldProps={{
                    label: 'User Email',
                    type: 'email',
                    placeholder: 'e.g. user@example.com',
                  }}
                />
                <FormController
                  control={control}
                  name="description"
                  Field={Textarea}
                  fieldProps={{
                    label: 'Description Issue',
                    placeholder: 'Detailed description',
                    rows: 5,
                  }}
                />
                <FormController
                  control={control}
                  name="dueDate"
                  Field={InputDatePicker}
                  fieldProps={{
                    label: 'Due On',
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
