'use client'

import { X, Download, Trash2, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getFileIcon, getTypeLabel, formatDate } from '../helpers'
import type { FSItem } from '../types'

interface FileDetailSidebarProps {
  item: FSItem | null
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </span>
    </div>
  )
}

export function FileDetailSidebar({ item, onClose }: FileDetailSidebarProps) {
  const isOpen = item !== null

  return (
    <div
      className={`bg-background sticky top-0 flex flex-col transition-all duration-200 ease-linear ${
        isOpen ? 'w-80 rounded-xl border' : 'w-0 overflow-hidden border-l-0'
      }`}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          File Details
        </span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {item && (
          <div className="flex flex-col gap-6">
            {/* Preview */}
            <div className="flex items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 py-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col items-center gap-3">
                {item.type === 'folder' ? (
                  <Folder className="h-16 w-16 fill-orange-300 text-orange-500" />
                ) : (
                  <div className="scale-150">{getFileIcon(item.type)}</div>
                )}
                <span className="max-w-[200px] truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item.name}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <DetailRow label="Type" value={getTypeLabel(item.type)} />
              <Separator />
              <DetailRow label="Size" value={item.size ?? '—'} />
              <Separator />
              <DetailRow label="Created" value={formatDate(item.createdAt)} />
              <DetailRow label="Created by" value={item.createdBy} />
              <Separator />
              <DetailRow
                label="Modified"
                value={formatDate(item.dateModified)}
              />
              <DetailRow label="Modified by" value={item.modifiedBy} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {item && (
        <div className="shrink-0 border-t px-4 py-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
