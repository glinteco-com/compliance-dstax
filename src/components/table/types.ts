import { ReactNode } from 'react'

export type TableOrder = 'asc' | 'desc'
export type OnSort = (columnId: string, by?: TableOrder) => void

export interface Column<T> {
  id: string
  label: string
  width?: number
  ellipsis?: boolean
  sortable?: boolean
  render: (record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface ColumnHeaderProps {
  id: string
  label: string
  width?: number
  ellipsis?: boolean
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string
}
