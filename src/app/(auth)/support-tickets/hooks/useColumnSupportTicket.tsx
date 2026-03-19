import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { Ticket } from '@/types/support-ticket'
import { cn } from '@/lib/utils'

interface UseColumnSupportTicketProps {
  onView: (item: Ticket) => void
  onEdit: (item: Ticket) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  normal:
    'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  high: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
}

export const useColumnSupportTicket = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnSupportTicketProps) => {
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
      render: (ticket) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
            priorityColors[ticket.priority]
          )}
        >
          {ticket.priority}
        </span>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      render: (ticket) => ticket.email,
    },
    {
      id: 'actions',
      label: '',
      width: 120,
      align: 'right',
      render: (ticket) => (
        <div className="flex items-center justify-end gap-2">
          <CommonTooltip content="View Details">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
              onClick={() => onView(ticket)}
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
              onClick={() => onEdit(ticket)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Delete">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete(ticket.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CommonTooltip>
        </div>
      ),
    },
  ]

  return { columns }
}
