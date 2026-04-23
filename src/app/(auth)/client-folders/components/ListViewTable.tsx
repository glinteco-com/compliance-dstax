'use client'

import { cn } from '@/lib/utils'
import { getFileIcon, getTypeLabel, formatDate } from '../helpers'
import { ItemActionsMenu } from './ItemActionsMenu'
import type { FSItem } from '../types'

interface ListViewTableProps {
  items: FSItem[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
  onOpenFolder: (item: FSItem) => void
}

export function ListViewTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isDstaxRole,
  onDetails,
  onOpenFolder,
}: ListViewTableProps) {
  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.has(item.id))
  const someSelected =
    items.some((item) => selectedIds.has(item.id)) && !allSelected

  return (
    <div className="rounded-md border bg-white dark:bg-zinc-950">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(element) => {
                  if (element) element.indeterminate = someSelected
                }}
                onChange={onToggleAll}
                className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-orange-500"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Name
            </th>
            <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Type
            </th>
            <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Date Modified
            </th>
            <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Size
            </th>
            <th className="w-16 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id)
            return (
              <tr
                key={item.id}
                className={cn(
                  'h-12 border-b border-zinc-100 transition-colors last:border-0 dark:border-zinc-800',
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/20'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                )}
              >
                <td className="px-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-orange-500"
                  />
                </td>
                <td className="max-w-md px-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="shrink-0">{getFileIcon(item.type)}</div>
                    <button
                      className="truncate text-sm font-medium text-zinc-800 hover:underline dark:text-zinc-200"
                      onClick={() =>
                        item.type === 'folder'
                          ? onOpenFolder(item)
                          : onDetails(item)
                      }
                      title={item.name}
                    >
                      {item.name}
                    </button>
                  </div>
                </td>
                <td className="px-4">
                  <span className="text-sm text-zinc-500">
                    {getTypeLabel(item.type)}
                  </span>
                </td>
                <td className="px-4">
                  <span className="text-sm text-zinc-500">
                    {formatDate(item.dateModified)}
                  </span>
                </td>
                <td className="px-4">
                  <span className="text-sm text-zinc-500">
                    {item.size ?? '—'}
                  </span>
                </td>
                <td className="px-4 text-right">
                  <ItemActionsMenu
                    item={item}
                    isDstaxRole={isDstaxRole}
                    onDetails={onDetails}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
