'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export type CellValue = string | number | boolean | null | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpreadsheetRow = Record<string, any>

export type ColumnType = 'text' | 'number' | 'currency' | 'date' | 'checkbox'

export interface SpreadsheetColumn {
  id: string
  label: string
  width?: number
  type?: ColumnType
  readOnly?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface SpreadsheetGridProps {
  columns: SpreadsheetColumn[]
  data: SpreadsheetRow[]
  editableColumns?: string[]
  onChange?: (rowIndex: number, columnId: string, value: CellValue) => void
  onAddRow?: () => void
  className?: string
  stickyHeader?: boolean
  stickyRowNumbers?: boolean
  rowNumbers?: boolean
  emptyMessage?: string
  errorCells?: Set<string>
}

function formatCellValue(value: CellValue, type?: ColumnType): string {
  if (value == null || value === '') return ''
  if (type === 'currency') {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    if (isNaN(num)) return String(value)
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  if (type === 'checkbox') {
    return value ? 'Yes' : 'No'
  }
  return String(value)
}

function parseCellInput(inputValue: string, type?: ColumnType): CellValue {
  if (type === 'number' || type === 'currency') {
    const cleaned = inputValue.replace(/[,$\s]/g, '')
    if (cleaned === '' || cleaned === '-') return cleaned
    const num = parseFloat(cleaned)
    return isNaN(num) ? inputValue : num
  }
  return inputValue
}

export function SpreadsheetGrid({
  columns,
  data,
  editableColumns,
  onChange,
  onAddRow,
  className,
  stickyHeader = true,
  stickyRowNumbers = true,
  rowNumbers = true,
  emptyMessage = 'No data available.',
  errorCells,
}: SpreadsheetGridProps) {
  const [focusedCell, setFocusedCell] = React.useState<{
    row: number
    col: number
  } | null>(null)
  const [editing, setEditing] = React.useState(false)

  const inputRefs = React.useRef<Map<string, HTMLInputElement>>(new Map())
  const cellRefs = React.useRef<Map<string, HTMLTableCellElement>>(new Map())

  const isEditable = (col: SpreadsheetColumn) => {
    if (col.readOnly) return false
    if (!editableColumns) return true
    return editableColumns.includes(col.id)
  }

  const getCellKey = (row: number, col: number | string) => `${row}-${col}`

  const navigateToCell = React.useCallback(
    (row: number, colIndex: number, startEditing = false) => {
      if (row < 0 || row >= data.length) return
      if (colIndex < 0 || colIndex >= columns.length) return

      const col = columns[colIndex]
      setFocusedCell({ row, col: colIndex })

      if (isEditable(col) && startEditing && col.type !== 'checkbox') {
        setEditing(true)
        requestAnimationFrame(() => {
          const input = inputRefs.current.get(getCellKey(row, col.id))
          input?.focus()
          input?.select()
        })
      } else {
        setEditing(false)
        requestAnimationFrame(() => {
          const td = cellRefs.current.get(getCellKey(row, colIndex))
          td?.focus()
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.length, columns, editableColumns]
  )

  const handleCellClick = (
    row: number,
    colIndex: number,
    col: SpreadsheetColumn
  ) => {
    if (col.type === 'checkbox' && isEditable(col)) {
      const current = data[row]?.[col.id]
      onChange?.(row, col.id, !current)
      setFocusedCell({ row, col: colIndex })
      setEditing(false)
      return
    }
    if (isEditable(col)) {
      navigateToCell(row, colIndex, true)
    } else {
      navigateToCell(row, colIndex, false)
    }
  }

  const handleGridKeyDown = (
    e: React.KeyboardEvent,
    row: number,
    colIndex: number
  ) => {
    const col = columns[colIndex]
    const editable = isEditable(col)

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        navigateToCell(
          row - 1,
          colIndex,
          editing && isEditable(columns[colIndex])
        )
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        navigateToCell(
          row + 1,
          colIndex,
          editing && isEditable(columns[colIndex])
        )
        break
      }
      case 'ArrowLeft': {
        if (editing && editable) break
        e.preventDefault()
        navigateToCell(row, colIndex - 1, false)
        break
      }
      case 'ArrowRight': {
        if (editing && editable) break
        e.preventDefault()
        navigateToCell(row, colIndex + 1, false)
        break
      }
      case 'Tab': {
        e.preventDefault()
        const direction = e.shiftKey ? -1 : 1
        const editableCols = columns
          .map((c, i) => ({ col: c, index: i }))
          .filter(({ col: c }) => isEditable(c))
        const currentEditableIdx = editableCols.findIndex(
          (ec) => ec.index === colIndex
        )
        let nextIdx = currentEditableIdx + direction
        let nextRow = row

        if (nextIdx < 0) {
          nextRow = row - 1
          nextIdx = editableCols.length - 1
        } else if (nextIdx >= editableCols.length) {
          nextRow = row + 1
          nextIdx = 0
        }

        if (nextRow >= 0 && nextRow < data.length && editableCols[nextIdx]) {
          navigateToCell(nextRow, editableCols[nextIdx].index, true)
        }
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (!editing && editable) {
          navigateToCell(row, colIndex, true)
        } else if (row < data.length - 1) {
          navigateToCell(row + 1, colIndex, editing)
        } else if (onAddRow) {
          onAddRow()
          requestAnimationFrame(() => {
            navigateToCell(data.length, colIndex, editing)
          })
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        setEditing(false)
        requestAnimationFrame(() => {
          const td = cellRefs.current.get(getCellKey(row, colIndex))
          td?.focus()
        })
        break
      }
    }
  }

  const isFocused = (row: number, colIndex: number) =>
    focusedCell?.row === row && focusedCell?.col === colIndex

  const isActiveEditing = (row: number, colIndex: number) =>
    isFocused(row, colIndex) && editing

  const stickyColClass = stickyRowNumbers ? 'sticky left-0 z-[5]' : ''

  return (
    <div
      className={cn(
        'bg-background relative min-h-0 w-full flex-1 overflow-hidden rounded-md border border-zinc-200 shadow-sm',
        className
      )}
    >
      <div className="absolute inset-0 overflow-auto rounded-md">
        <table className="w-max min-w-full border-collapse">
          <thead>
            <tr
              className={cn('bg-zinc-50', stickyHeader && 'sticky top-0 z-10')}
            >
              {rowNumbers && (
                <th
                  className={cn(
                    'w-12 border-r border-b border-zinc-200 bg-zinc-100 px-2 py-2 text-center text-xs font-medium text-zinc-400',
                    stickyHeader && stickyRowNumbers && 'z-20',
                    stickyColClass
                  )}
                >
                  #
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'border-r border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-zinc-600 last:border-r-0',
                    !isEditable(col) && 'bg-zinc-100/50',
                    (col.align === 'right' ||
                      col.type === 'currency' ||
                      col.type === 'number') &&
                      'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                  style={{
                    width: col.width ? `${col.width}px` : undefined,
                    minWidth: col.width
                      ? `${col.width}px`
                      : col.type === 'currency'
                        ? '140px'
                        : '120px',
                  }}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      (col.align === 'right' ||
                        col.type === 'currency' ||
                        col.type === 'number') &&
                        'justify-end',
                      col.align === 'center' && 'justify-center'
                    )}
                  >
                    {col.label}
                    {!isEditable(col) && (
                      <span className="rounded bg-zinc-200 px-1 py-0.5 text-[10px] font-normal text-zinc-500">
                        read-only
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'group transition-colors hover:bg-orange-50',
                  focusedCell?.row === rowIndex &&
                    'relative z-10 ring-[1.5px] ring-orange-300 ring-inset'
                )}
              >
                {rowNumbers && (
                  <td
                    className={cn(
                      'border-r border-b border-zinc-200 bg-zinc-50 px-2 py-0 text-center text-xs font-medium text-zinc-400',
                      stickyColClass
                    )}
                  >
                    {rowIndex + 1}
                  </td>
                )}
                {columns.map((col, colIndex) => {
                  const editable = isEditable(col)
                  const focused = isFocused(rowIndex, colIndex)
                  const activeEdit = isActiveEditing(rowIndex, colIndex)
                  const cellValue = row[col.id]
                  const isCheckbox = col.type === 'checkbox'
                  const isNumeric =
                    col.type === 'currency' || col.type === 'number'
                  const hasError = errorCells?.has(`${rowIndex}-${col.id}`)

                  return (
                    <td
                      key={col.id}
                      ref={(el) => {
                        if (el) {
                          cellRefs.current.set(
                            getCellKey(rowIndex, colIndex),
                            el
                          )
                        }
                      }}
                      tabIndex={-1}
                      className={cn(
                        'relative border-r border-b border-zinc-200 p-0 outline-none last:border-r-0',
                        !editable && 'bg-zinc-50/50',
                        !hasError &&
                          focused &&
                          'ring-2 ring-orange-500 ring-inset',
                        hasError && 'ring-2 ring-red-500 ring-inset',
                        editable &&
                          !focused &&
                          'cursor-text hover:bg-orange-50',
                        isCheckbox && 'cursor-pointer'
                      )}
                      onClick={() => handleCellClick(rowIndex, colIndex, col)}
                      onKeyDown={(e) =>
                        handleGridKeyDown(e, rowIndex, colIndex)
                      }
                    >
                      {isCheckbox ? (
                        <div className="flex items-center justify-center px-3 py-2">
                          <input
                            type="checkbox"
                            checked={Boolean(cellValue)}
                            disabled={!editable}
                            tabIndex={-1}
                            onChange={() => {
                              if (editable) {
                                onChange?.(rowIndex, col.id, !cellValue)
                              }
                            }}
                            className="h-4 w-4 cursor-pointer accent-orange-500"
                          />
                        </div>
                      ) : editable && activeEdit ? (
                        <Input
                          ref={(el) => {
                            if (el) {
                              inputRefs.current.set(
                                getCellKey(rowIndex, col.id),
                                el
                              )
                            }
                          }}
                          value={String(cellValue ?? '')}
                          onChange={(e) =>
                            onChange?.(
                              rowIndex,
                              col.id,
                              parseCellInput(e.target.value, col.type)
                            )
                          }
                          onBlur={() => setEditing(false)}
                          onKeyDown={(e) =>
                            handleGridKeyDown(e, rowIndex, colIndex)
                          }
                          className={cn(
                            'h-auto rounded-none border-none bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0',
                            isNumeric && 'text-right'
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            'px-3 py-2 text-sm',
                            !editable && 'text-zinc-500',
                            isNumeric && 'text-right'
                          )}
                        >
                          {formatCellValue(cellValue, col.type)}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (rowNumbers ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-zinc-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
