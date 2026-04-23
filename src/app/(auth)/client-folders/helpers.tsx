import { Folder, FileText, FileSpreadsheet, File } from 'lucide-react'
import type { FileItemType } from './types'

export function getFileIcon(type: FileItemType) {
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

export function getTypeLabel(type: FileItemType): string {
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

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
