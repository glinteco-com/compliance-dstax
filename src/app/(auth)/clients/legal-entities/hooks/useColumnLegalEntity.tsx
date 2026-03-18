import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { LegalEntity } from '@/types/legal-entity'

interface UseColumnLegalEntityProps {
  onView: (item: LegalEntity) => void
  onEdit: (item: LegalEntity) => void
  onDelete: (id: string) => void
}

export const useColumnLegalEntity = ({
  onView,
  onEdit,
  onDelete,
}: UseColumnLegalEntityProps) => {
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
