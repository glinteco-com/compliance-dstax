import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Mail, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { Preparer } from '@/types/dstax-preparer'

interface UseColumnDstaxPreparerProps {
  onView: (item: Preparer) => void
  onEdit: (item: Preparer) => void
  onDelete: (id: string) => void
}

export const useColumnDstaxPreparer = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnDstaxPreparerProps) => {
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
              onClick={() => onView(item)}
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
              onClick={() => onEdit(item)}
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
              onClick={() => onDelete(item.id)}
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
