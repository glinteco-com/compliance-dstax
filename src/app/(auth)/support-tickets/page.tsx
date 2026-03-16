'use client'

import * as React from 'react'
import { CommonTable, Column } from '@/components/table/CommonTable'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Loader2 } from 'lucide-react'
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
import { DatePickerInput } from '@/components/datepicker/DatePicker'
import FormController from '@/components/form/FormController'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const ticketSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  summary: z.string().min(1, 'Summary is required'),
  createdDate: z.string().min(1, 'Create date is required'),
  priority: z.enum(['low', 'normal', 'high']),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().optional(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

interface Ticket {
  id: string
  createdDate: string
  name: string
  priority: 'low' | 'normal' | 'high'
  email: string
  summary?: string
  description?: string
  dueDate?: string
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TICK-1001',
    createdDate: '2024-03-15',
    name: 'Login Issue',
    priority: 'high',
    email: 'user1@example.com',
    summary: 'Cannot login to the application',
    description: 'When I enter my credentials, it just refreshes the page.',
    dueDate: '2024-03-20',
  },
  {
    id: 'TICK-1002',
    createdDate: '2024-03-14',
    name: 'Dashboard not loading',
    priority: 'high',
    email: 'user2@example.com',
    summary: 'Blank screen after login',
    description: 'The dashboard widgets are not showing up.',
    dueDate: '2024-03-18',
  },
  {
    id: 'TICK-1003',
    createdDate: '2024-03-13',
    name: 'Question about reports',
    priority: 'normal',
    email: 'user3@example.com',
    summary: 'How to export PDF?',
    description: 'I need to know where the export button for PDF reports is.',
    dueDate: '2024-03-25',
  },
  {
    id: 'TICK-1004',
    createdDate: '2024-03-12',
    name: 'Mobile responsive issue',
    priority: 'low',
    email: 'user4@example.com',
  },
  {
    id: 'TICK-1005',
    createdDate: '2024-03-11',
    name: 'Feature request: export CSV',
    priority: 'normal',
    email: 'user5@example.com',
  },
]

export default function SupportTicketsPage() {
  const [page, setPage] = React.useState(1)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
    null
  )

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      summary: '',
      createdDate: new Date().toISOString().split('T')[0],
      priority: 'normal',
      description: '',
      dueDate: '',
    },
  })

  React.useEffect(() => {
    if (selectedTicket) {
      form.reset({
        name: selectedTicket.name,
        summary: selectedTicket.summary || '',
        createdDate: selectedTicket.createdDate,
        priority: selectedTicket.priority,
        description: selectedTicket.description || '',
        dueDate: selectedTicket.dueDate || '',
      })
    } else {
      form.reset({
        name: '',
        summary: '',
        createdDate: new Date().toISOString().split('T')[0],
        priority: 'normal',
        description: '',
        dueDate: '',
      })
    }
  }, [selectedTicket, form])

  const onSubmit = (data: TicketFormValues) => {
    console.log('Form data:', data)
    // Here you would normally call an API
    setIsOpen(false)
  }

  const handleOpenCreate = () => {
    setSelectedTicket(null)
    setIsOpen(true)
  }

  const handleOpenView = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsOpen(true)
  }

  const columns: Column<Ticket>[] = [
    {
      id: 'id',
      label: 'ID',
      className: 'font-mono text-xs w-[100px]',
      render: (ticket) => ticket.id,
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (ticket) => ticket.createdDate,
    },
    {
      id: 'name',
      label: 'Name',
      render: (ticket) => ticket.name,
    },
    {
      id: 'priority',
      label: 'Priority',
      render: (ticket: Ticket) => {
        const priorityColors = {
          low: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
          normal:
            'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
          high: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
        }

        return (
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
              priorityColors[ticket.priority]
            )}
          >
            {ticket.priority}
          </span>
        )
      },
    },
    {
      id: 'email',
      label: 'Email',
      render: (ticket) => ticket.email,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (ticket) => (
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handleOpenView(ticket)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Support Tickets
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage and respond to user support requests.
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <CommonTable
        columns={columns}
        data={MOCK_TICKETS}
        pagination={{
          currentPage: page,
          totalPages: 1,
          onPageChange: (newPage) => setPage(newPage),
          totalItems: MOCK_TICKETS.length,
        }}
      />

      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
        <DrawerContent className="flex h-full flex-col">
          <DrawerHeader className="border-b px-6 py-4">
            <DrawerTitle>
              {selectedTicket
                ? `Ticket Details: ${selectedTicket.id}`
                : 'Create New Ticket'}
            </DrawerTitle>
            <DrawerDescription>
              {selectedTicket
                ? 'Review the ticket information below.'
                : 'Fill in the details to create a new support ticket.'}
            </DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-6 py-6"
          >
            <FormController
              name="name"
              control={form.control}
              Field={Input}
              fieldProps={{
                label: 'Name ticket',
                placeholder: 'Enter ticket name',
                disabled: !!selectedTicket,
              }}
            />

            <FormController
              name="summary"
              control={form.control}
              Field={Input}
              fieldProps={{
                label: 'Summary of the problem',
                placeholder: 'Brief summary',
                disabled: !!selectedTicket,
              }}
            />

            <FormController
              name="createdDate"
              control={form.control}
              Field={DatePickerInput}
              fieldProps={{
                label: 'Create date',
                disabled: true, // Usually auto-generated
              }}
            />

            <FormController
              name="priority"
              control={form.control}
              Field={Input} // Using Input for now as requested, though ideally a Select
              fieldProps={{
                label: 'Priority',
                placeholder: 'low, normal, high',
                disabled: !!selectedTicket,
              }}
            />

            <FormController
              name="description"
              control={form.control}
              Field={Textarea}
              fieldProps={{
                label: 'Description issue',
                placeholder: 'Detailed description',
                disabled: !!selectedTicket,
                rows: 5,
              }}
            />

            <FormController
              name="dueDate"
              control={form.control}
              Field={DatePickerInput}
              fieldProps={{
                label: 'Due on',
                disabled: !!selectedTicket,
              }}
            />
          </form>

          <DrawerFooter className="flex-row gap-2 border-t px-6 py-4">
            {!selectedTicket && (
              <Button
                type="submit"
                className="flex-1"
                onClick={form.handleSubmit(onSubmit)}
                isLoading={form.formState.isSubmitting}
              >
                Create Ticket
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
