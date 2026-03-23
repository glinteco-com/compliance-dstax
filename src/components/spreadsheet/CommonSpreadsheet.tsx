'use client'

import { useCallback } from 'react'
import { HotTable, HotTableProps } from '@handsontable/react-wrapper'
import { registerAllModules } from 'handsontable/registry'
import type { CellChange, ChangeSource } from 'handsontable/common'
import type { ColumnSettings } from 'handsontable/settings'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import { cn } from '@/lib/utils'

registerAllModules()

export interface CellEditEvent {
  row: number
  col: string | number
  oldValue: unknown
  newValue: unknown
}

export interface CustomColumnSettings extends Omit<
  ColumnSettings,
  'type' | 'dateFormat'
> {
  type?: ColumnSettings['type'] | 'intl-date' | 'intl-time'
  dateFormat?: string | Record<string, string>
  timeFormat?: Record<string, string | boolean>
  numericFormat?: Record<string, string | number | boolean>
}

export interface CommonSpreadsheetProps extends Omit<
  HotTableProps,
  'licenseKey' | 'columns'
> {
  className?: string
  columns?: CustomColumnSettings[] | ((index: number) => CustomColumnSettings)
  onCellEdit?: (event: CellEditEvent) => void
}

export function CommonSpreadsheet({
  className,
  columns,
  onCellEdit,
  afterChange,
  ...hotTableProps
}: CommonSpreadsheetProps) {
  const handleAfterChange = useCallback(
    (changes: CellChange[] | null, source: ChangeSource) => {
      if (source === 'loadData' || !changes) return

      if (onCellEdit) {
        changes.forEach(([row, col, oldValue, newValue]) => {
          if (oldValue !== newValue) {
            onCellEdit({
              row,
              col: typeof col === 'function' ? row : col,
              oldValue,
              newValue,
            })
          }
        })
      }

      afterChange?.(changes, source)
    },
    [onCellEdit, afterChange]
  )

  return (
    <div
      className={cn(
        'bg-background relative min-h-0 w-full flex-1 rounded-md shadow-sm',
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <HotTable
          width="100%"
          height="100%"
          autoWrapRow={true}
          autoWrapCol={true}
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          filters={true}
          dropdownMenu={true}
          columnSorting={true}
          manualColumnResize={true}
          manualRowResize={true}
          stretchH="all"
          className="border-0"
          columns={columns as ColumnSettings[]}
          afterChange={handleAfterChange}
          {...hotTableProps}
        />
      </div>
    </div>
  )
}
