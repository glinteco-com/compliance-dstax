'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Column } from './types'
export type { Column }

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
}

interface CommonTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  pagination?: PaginationProps
  className?: string
  onRowClick?: (item: T) => void
}

export function CommonTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  pagination,
  className,
  onRowClick,
}: CommonTableProps<T>) {
  const showPagination = pagination && pagination.totalPages > 1

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column.id}
                  style={column.width ? { width: column.width } : undefined}
                  className={cn(
                    'h-11 font-semibold text-zinc-900 dark:text-zinc-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    'h-12 border-zinc-100 dark:border-zinc-800',
                    onRowClick &&
                      'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        'text-zinc-700 dark:text-zinc-300',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.ellipsis && 'truncate',
                        column.className
                      )}
                    >
                      {column.render(item, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {pagination.totalItems !== undefined ? (
              <>Total {pagination.totalItems} items</>
            ) : null}
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage <= 1}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                disabled={pagination.currentPage >= pagination.totalPages}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
