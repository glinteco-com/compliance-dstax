'use client'

import React from 'react'
import { HotTable } from '@handsontable/react-wrapper'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import { Button } from '@/components/ui/button'

// register Handsontable's modules
registerAllModules()

export default function TVRsPage() {
  const data = [
    {
      id: 1,
      entity: 'Global Corp',
      taxType: 'Sales Tax',
      period: 'Q1 2026',
      amount: '$150,000.00',
      status: 'Prepared',
    },
    {
      id: 2,
      entity: 'Tech Solutions Inc',
      taxType: 'Use Tax',
      period: 'Q1 2026',
      amount: '$45,200.50',
      status: 'Reviewed',
    },
    {
      id: 3,
      entity: 'Retail Giant LLC',
      taxType: 'Sales Tax',
      period: 'Q1 2026',
      amount: '$320,500.00',
      status: 'Pending',
    },
    {
      id: 4,
      entity: 'Local Shop',
      taxType: 'Sales Tax',
      period: 'Q1 2026',
      amount: '$12,400.00',
      status: 'Filed',
    },
    {
      id: 5,
      entity: 'Manufacturing Co',
      taxType: 'Use Tax',
      period: 'Q1 2026',
      amount: '$85,000.00',
      status: 'Pending',
    },
  ]

  const colHeaders = [
    'ID',
    'Legal Entity',
    'Tax Type',
    'Filing Period',
    'Amount',
    'Status',
  ]

  const columns = [
    { data: 'id', type: 'numeric', readOnly: true },
    { data: 'entity', type: 'text' },
    {
      data: 'taxType',
      type: 'dropdown',
      source: ['Sales Tax', 'Use Tax', 'VAT', 'GST'],
    },
    { data: 'period', type: 'text' },
    { data: 'amount', type: 'numeric', numericFormat: { pattern: '$0,0.00' } },
    {
      data: 'status',
      type: 'dropdown',
      source: ['Pending', 'Prepared', 'Reviewed', 'Filed', 'Rejected'],
    },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Tax Verification Reports (TVRs)
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="default">PREPARED</Button>
          <Button variant="secondary">REVIEW COMMENTS</Button>
          <Button variant="outline">PUBLISH RETURNS</Button>
          <Button variant="default">FUNDING RECEIVED</Button>
        </div>
      </div>
      <div className="bg-background relative flex min-h-0 w-full flex-1 overflow-hidden rounded-md border p-2 shadow-sm">
        <HotTable
          data={data}
          columns={columns}
          colHeaders={colHeaders}
          rowHeaders={true}
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
        />
      </div>
    </div>
  )
}
