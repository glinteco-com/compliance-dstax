'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Folder,
  FileText,
  FileSpreadsheet,
  Download,
  Trash2,
  Info,
  MoreHorizontal,
  List,
  LayoutGrid,
  SlidersHorizontal,
  FolderPlus,
  Upload,
  ChevronRight,
  Home,
  FolderOpen,
  ArrowUpFromLine,
  File,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useRole } from '@/lib/auth/role-utils'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FileItemType = 'folder' | 'pdf' | 'csv' | 'xlsx' | 'doc'
type ViewMode = 'list' | 'grid'
type TabValue = 'client-documents' | 'archived-returns' | 'client-data'

interface FSItem {
  id: string
  name: string
  type: FileItemType
  dateModified: string
  size?: string
  createdAt: string
  createdBy: string
  modifiedBy: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DOCUMENTS: FSItem[] = [
  {
    id: '1',
    name: 'Annual Reports',
    type: 'folder',
    dateModified: '2024-03-15',
    createdAt: '2024-01-10',
    createdBy: 'John Doe',
    modifiedBy: 'Jane Smith',
  },
  {
    id: '2',
    name: 'Tax Documents 2023',
    type: 'folder',
    dateModified: '2024-02-20',
    createdAt: '2024-01-15',
    createdBy: 'John Doe',
    modifiedBy: 'John Doe',
  },
  {
    id: '3',
    name: 'Client Forms',
    type: 'folder',
    dateModified: '2024-03-01',
    createdAt: '2024-02-01',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
  {
    id: '4',
    name: 'Q1_Report.pdf',
    type: 'pdf',
    dateModified: '2024-03-10',
    size: '2.4 MB',
    createdAt: '2024-03-10',
    createdBy: 'Jane Smith',
    modifiedBy: 'Jane Smith',
  },
  {
    id: '5',
    name: 'Client_Data.csv',
    type: 'csv',
    dateModified: '2024-03-08',
    size: '1.1 MB',
    createdAt: '2024-03-08',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
  {
    id: '6',
    name: 'Financial_Summary.xlsx',
    type: 'xlsx',
    dateModified: '2024-03-05',
    size: '3.7 MB',
    createdAt: '2024-03-01',
    createdBy: 'John Doe',
    modifiedBy: 'Jane Smith',
  },
  {
    id: '7',
    name: 'Compliance_Report.pdf',
    type: 'pdf',
    dateModified: '2024-02-28',
    size: '5.2 MB',
    createdAt: '2024-02-15',
    createdBy: 'Jane Smith',
    modifiedBy: 'Jane Smith',
  },
]

const MOCK_ARCHIVED: FSItem[] = [
  {
    id: 'a1',
    name: 'Returns 2022',
    type: 'folder',
    dateModified: '2023-04-10',
    createdAt: '2022-12-01',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
  {
    id: 'a2',
    name: 'Returns 2021',
    type: 'folder',
    dateModified: '2022-04-15',
    createdAt: '2021-12-01',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
  {
    id: 'a3',
    name: 'Archive_2022_Final.pdf',
    type: 'pdf',
    dateModified: '2023-01-05',
    size: '8.1 MB',
    createdAt: '2023-01-05',
    createdBy: 'John Doe',
    modifiedBy: 'John Doe',
  },
]

const MOCK_CLIENT_DATA: FSItem[] = [
  {
    id: 'c1',
    name: 'Client Records',
    type: 'folder',
    dateModified: '2024-04-01',
    createdAt: '2024-01-01',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
  {
    id: 'c2',
    name: 'Imports',
    type: 'folder',
    dateModified: '2024-03-28',
    createdAt: '2024-02-10',
    createdBy: 'Jane Smith',
    modifiedBy: 'Jane Smith',
  },
  {
    id: 'c3',
    name: 'client_export_march.csv',
    type: 'csv',
    dateModified: '2024-03-31',
    size: '4.2 MB',
    createdAt: '2024-03-31',
    createdBy: 'Jane Smith',
    modifiedBy: 'Jane Smith',
  },
  {
    id: 'c4',
    name: 'data_template.xlsx',
    type: 'xlsx',
    dateModified: '2024-03-20',
    size: '0.9 MB',
    createdAt: '2024-01-15',
    createdBy: 'Admin',
    modifiedBy: 'Admin',
  },
]

const TAB_DATA: Record<TabValue, FSItem[]> = {
  'client-documents': MOCK_DOCUMENTS,
  'archived-returns': MOCK_ARCHIVED,
  'client-data': MOCK_CLIENT_DATA,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFileIcon(type: FileItemType, size = 18) {
  const className = `h-[${size}px] w-[${size}px]`
  switch (type) {
    case 'folder':
      return (
        <Folder className="h-[18px] w-[18px] fill-orange-400 text-orange-500" />
      )
    case 'pdf':
      return <FileText className="h-[18px] w-[18px] text-red-500" />
    case 'csv':
      return <File className="h-[18px] w-[18px] text-green-600" />
    case 'xlsx':
      return <FileSpreadsheet className="h-[18px] w-[18px] text-emerald-600" />
    default:
      return <FileText className="h-[18px] w-[18px] text-zinc-400" />
  }
}

function getTypeLabel(type: FileItemType): string {
  switch (type) {
    case 'folder':
      return 'Folder'
    case 'pdf':
      return 'PDF'
    case 'csv':
      return 'CSV'
    case 'xlsx':
      return 'Excel'
    default:
      return 'File'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ItemActionsMenu({
  item,
  isDstaxRole,
  onDetails,
}: {
  item: FSItem
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
}) {
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

// ---------------------------------------------------------------------------
// List View
// ---------------------------------------------------------------------------

function ListViewTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isDstaxRole,
  onDetails,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
}: {
  items: FSItem[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
  onDrop: (event: React.DragEvent) => void
  isDragOver: boolean
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: () => void
}) {
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
                <td className="px-4">
                  <div className="flex items-center gap-2">
                    {getFileIcon(item.type)}
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {item.name}
                    </span>
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

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'flex items-center justify-center gap-2 rounded-b-md border-t border-dashed px-4 py-6 text-sm transition-colors',
          isDragOver
            ? 'border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950/20'
            : 'border-zinc-200 text-zinc-400 dark:border-zinc-800'
        )}
      >
        <Upload className="h-4 w-4" />
        Drop files here to upload
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Grid View
// ---------------------------------------------------------------------------

function GridView({
  items,
  selectedIds,
  onToggleSelect,
  isDstaxRole,
  onDetails,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
}: {
  items: FSItem[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  isDstaxRole: boolean
  onDetails: (item: FSItem) => void
  onDrop: (event: React.DragEvent) => void
  isDragOver: boolean
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: () => void
}) {
  const folders = items.filter((item) => item.type === 'folder')
  const files = items.filter((item) => item.type !== 'folder')

  return (
    <div className="space-y-6">
      {/* Folders section */}
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
                  onClick={() => onToggleSelect(folder.id)}
                >
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

      {/* Files section */}
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
                  onClick={() => onToggleSelect(file.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={cn(
                      'absolute top-2 left-2 transition-opacity',
                      isSelected
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    )}
                    onClick={(event) => event.stopPropagation()}
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

            {/* Drop-to-upload card */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={cn(
                'flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-xs transition-colors',
                isDragOver
                  ? 'border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950/20'
                  : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 dark:border-zinc-800'
              )}
            >
              <Upload className="h-5 w-5" />
              <span>Drop to upload</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// File Details Sheet
// ---------------------------------------------------------------------------

function FileDetailSheet({
  item,
  open,
  onOpenChange,
}: {
  item: FSItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!item) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>File Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6">
          {/* Preview icon */}
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
            <DetailRow label="Modified" value={formatDate(item.dateModified)} />
            <DetailRow label="Modified by" value={item.modifiedBy} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
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

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const TABS: { value: TabValue; label: string }[] = [
  { value: 'client-documents', label: 'Client Documents' },
  { value: 'archived-returns', label: 'Archived Returns' },
  { value: 'client-data', label: 'Client Data' },
]

export default function ClientFoldersPage() {
  const { isDstaxRole } = useRole()

  const [activeTab, setActiveTab] = useState<TabValue>('client-documents')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailItem, setDetailItem] = useState<FSItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const items = TAB_DATA[activeTab]

  // Reset selection when tab changes
  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab)
    setSelectedIds(new Set())
  }, [])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleToggleAll = useCallback(() => {
    setSelectedIds((previous) => {
      if (previous.size === items.length) return new Set()
      return new Set(items.map((item) => item.id))
    })
  }, [items])

  const handleOpenDetails = useCallback((item: FSItem) => {
    setDetailItem(item)
    setIsDetailOpen(true)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    // placeholder: handle file upload
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const selectedCount = selectedIds.size

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4 p-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-zinc-500">
        <Link href="/" className="flex items-center gap-1 hover:text-zinc-700">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tvrs" className="hover:text-zinc-700">
          TVRS
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          Client Folders
        </span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Folders</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Manage and organize compliance documentation across global entities.
            Use the ledger below to access secure file storage.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Button size="sm" className="gap-1.5">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
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

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectedCount > 0 ? (
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
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* DSTAX-only action */}
          {isDstaxRole && (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowUpFromLine className="h-4 w-4" />
                Update a new version
              </Button>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-orange-700 uppercase dark:bg-orange-900/40 dark:text-orange-400">
                DSTax User Only
              </span>
            </div>
          )}

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setViewMode('list')}
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
              onClick={() => setViewMode('grid')}
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

      {/* Content */}
      {viewMode === 'list' ? (
        <ListViewTable
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          isDstaxRole={isDstaxRole}
          onDetails={handleOpenDetails}
          onDrop={handleDrop}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
      ) : (
        <GridView
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          isDstaxRole={isDstaxRole}
          onDetails={handleOpenDetails}
          onDrop={handleDrop}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
      )}

      {/* File Details Sheet */}
      <FileDetailSheet
        item={detailItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
