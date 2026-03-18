import { Column } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Key, Eye } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { User } from '@/types/user'

interface UseColumnClientUserProps {
  onView: (item: User) => void
  onEdit: (item: User) => void
  onResetPassword: (id: string) => void
  onDelete: (id: string) => void
}

export const useColumnClientUser = ({
  onView,
  onEdit,
  onResetPassword,
  onDelete,
}: UseColumnClientUserProps) => {
  const columns: Column<User>[] = [
    {
      id: 'clientName',
      label: 'Client Name',
      render: (item) => (
        <span className="font-medium text-zinc-900">{item.clientName}</span>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      render: (item) => <span>{item.name}</span>,
    },
    {
      id: 'username',
      label: 'Username',
      render: (item) => (
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
          {item.username}
        </code>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      render: (item) => (
        <span className="font-mono tracking-widest text-zinc-400">
          {item.password}
        </span>
      ),
    },
    {
      id: 'role',
      label: 'User Role',
      render: (item) => (
        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-700/10 ring-inset dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10">
          {item.role}
        </span>
      ),
    },
    {
      id: 'actions',
      label: '',
      width: 180,
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
          <CommonTooltip content="Reset Password">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
              onClick={() => onResetPassword(item.id)}
            >
              <Key className="h-4 w-4" />
              <span className="sr-only">Reset Password</span>
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
