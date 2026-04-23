'use client'

import {
  Download,
  FolderOpen,
  Info,
  ArrowUpFromLine,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FSItem } from '../types'

interface ItemActionsMenuProps {
  item: FSItem
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
}

export function ItemActionsMenu({
  item,
  isDstaxRole,
  onDetails,
}: ItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderOpen className="mr-2 h-4 w-4" />
          Move to...
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation()
            onDetails(item)
          }}
        >
          <Info className="mr-2 h-4 w-4" />
          Details
        </DropdownMenuItem>
        {isDstaxRole && (
          <DropdownMenuItem>
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Update new version
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
