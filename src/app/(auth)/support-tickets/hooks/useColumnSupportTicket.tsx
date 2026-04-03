import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { Ticket } from '@/types/support-ticket'

interface UseColumnSupportTicketProps {
  onView: (item: Ticket) => void
  onEdit: (item: Ticket) => void
  onDelete: (id: number) => void
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
      className: 'font-mono text-xs w-[80px]',
      render: (ticket) => ticket.id,
    },
    {
      id: 'title',
      label: 'Support Issue',
      render: (ticket) => (
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900">{ticket.title}</span>
          <span className="line-clamp-1 text-xs text-zinc-500">
            {ticket.description}
          </span>
        </div>
      ),
    },
    {
      id: 'client',
      label: 'Client',
      render: (ticket) => ticket.client?.name ?? '-',
    },
    {
      id: 'legal_entity',
      label: 'Legal Entity',
      render: (ticket) => ticket.legal_entity?.name ?? '-',
    },
    {
      id: 'created_by',
      label: 'Created By',
      render: (ticket) => ticket.created_by?.email ?? '-',
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
          {/* <CommonTooltip content="Edit">
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
          </CommonTooltip> */}
        </div>
      ),
    },
  ]

  return { columns }
}
