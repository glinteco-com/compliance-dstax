'use client'

import { Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFileIcon, formatDate } from '../helpers'
import { ItemActionsMenu } from './ItemActionsMenu'
import type { FSItem } from '../types'

interface GridViewProps {
  items: FSItem[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
  onOpenFolder: (item: FSItem) => void
}

export function GridView({
  items,
  selectedIds,
  onToggleSelect,
  isDstaxRole,
  onDetails,
  onOpenFolder,
}: GridViewProps) {
  const folders = items.filter((item) => item.type === 'folder')
  const files = items.filter((item) => item.type !== 'folder')

  return (
    <div className="space-y-6">
      {folders.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Folders
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {folders.map((folder) => {
              const isSelected = selectedIds.has(folder.id)
              return (
                <div
                  key={folder.id}
                  className={cn(
                    'group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 transition-colors',
                    isSelected
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                  )}
                  onClick={() => onOpenFolder(folder)}
                >
                  <div
                    className={cn(
                      'absolute top-2 left-2 transition-opacity',
                      isSelected
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    )}
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleSelect(folder.id)
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(folder.id)}
                      className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-orange-500"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <ItemActionsMenu
                      item={folder}
                      isDstaxRole={isDstaxRole}
                      onDetails={onDetails}
                    />
                  </div>
                  <Folder className="h-12 w-12 fill-orange-300 text-orange-500" />
                  <span className="w-full truncate text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {folder.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatDate(folder.dateModified)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Files
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((file) => {
              const isSelected = selectedIds.has(file.id)
              return (
                <div
                  key={file.id}
                  className={cn(
                    'group relative flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 transition-colors',
                    isSelected
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                  )}
                  onClick={() => onDetails(file)}
                >
                  <div
                    className={cn(
                      'absolute top-2 left-2 transition-opacity',
                      isSelected
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    )}
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleSelect(file.id)
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(file.id)}
                      className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-orange-500"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <ItemActionsMenu
                      item={file}
                      isDstaxRole={isDstaxRole}
                      onDetails={onDetails}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {formatDate(file.dateModified)}
                    </span>
                    {file.size && (
                      <span className="text-xs text-zinc-400">{file.size}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
