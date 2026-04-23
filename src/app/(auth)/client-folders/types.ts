export type FileItemType = 'folder' | 'pdf' | 'csv' | 'xlsx' | 'doc'
export type ViewMode = 'list' | 'grid'
export type TabValue = 'client-documents' | 'archived-returns' | 'client-data'

export interface FSItem {
  id: string
  name: string
  type: FileItemType
  dateModified: string
  size?: string
  createdAt: string
  createdBy: string
  modifiedBy: string
}
