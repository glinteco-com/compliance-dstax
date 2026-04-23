'use client'

import { useState } from 'react'
import {
  Download,
  Trash2,
  Info,
  List,
  LayoutGrid,
  FolderPlus,
  FolderOpen,
  ArrowUpFromLine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { NewFolderDialog } from './NewFolderDialog'
import { UploadButton } from './UploadButton'
import type { TabValue, ViewMode } from '../types'

const TABS: { value: TabValue; label: string }[] = [
  { value: 'client-documents', label: 'Client Documents' },
  { value: 'archived-returns', label: 'Archived Returns' },
  { value: 'client-data', label: 'Client Data' },
]

interface ClientFoldersToolbarProps {
  activeTab: TabValue
  onTabChange: (tab: TabValue) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedCount: number
  isDstaxRole: boolean
  onCreateFolder: (name: string) => void
}

export function ClientFoldersToolbar({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  isDstaxRole,
  onCreateFolder,
}: ClientFoldersToolbarProps) {
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.value
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {selectedCount} SELECTED
              </span>
              <Separator orientation="vertical" className="h-5" />
              <Button variant="ghost" size="icon-sm" title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" title="Move">
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                title="Delete"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" title="Details">
                <Info className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDstaxRole && (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowUpFromLine className="h-4 w-4" />
                Update a new version
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setIsNewFolderOpen(true)}
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>

          <UploadButton />

          {/* View mode toggle */}
          <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'flex items-center justify-center px-3 py-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900'
              )}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'flex items-center justify-center px-3 py-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900'
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <NewFolderDialog
        open={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        onCreateFolder={onCreateFolder}
      />
    </div>
  )
}
