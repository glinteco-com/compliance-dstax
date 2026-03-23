'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  CommonSpreadsheet,
  type CellEditEvent,
  type CustomColumnSettings,
} from '@/components/spreadsheet/CommonSpreadsheet'

export default function TVRsPage() {
  const handleCellEdit = useCallback((event: CellEditEvent) => {
    console.log('Cell edited:', event)
  }, [])

  const data = [
    {
      client: 'Acme Corp',
      legalEntity: 'Acme US LLC',
      jurisdiction: 'CA',
      taxType: 'Sales Tax',
      filingFrequency: 'Monthly',
      filingMethod: 'E-File',
      dueDate: '2026-04-20',
      deTime: '17:00',
      glAmount: 50000.0,
      salesTaxExtractAmount: 50000.0,
      amountToAdjust: 0,
      manualAdjustment: 0,
      useTax: 1500.0,
      nonMonthlyCarriedForwardPrior: 0,
      nonMonthlyCarriedForwardFuture: 0,
      creditsCarriedForwardPrior: 0,
      creditsCarriedForwardFuture: 0,
      localAdjustment: 0,
      grossDue: 51500.0,
      prepaymentCredit: 0,
      prepaymentDue: 0,
      vendorsDiscount: 250.0,
      businessAndOccupationTax: 0,
      rounding: 0,
      currencyConverted: 0,
      netDue: 51250.0,
      currencyCode: 'USD',
      amountToFund: 51250.0,
      statusConfirmationNumber: 'CONF-12345',
      paymentConfirmationNumber: 'PAY-67890',
      paymentAmount: 51250.0,
      filingDate: '2026-04-18',
      paymentDate: '2026-04-18',
      clientComment: 'All good',
      dstaxComment: 'Verified',
      isActive: true,
    },
    {
      client: 'Techy Inc',
      legalEntity: 'Techy NY Corp',
      jurisdiction: 'NY',
      taxType: 'Use Tax',
      filingFrequency: 'Quarterly',
      filingMethod: 'Paper',
      dueDate: '2026-04-20',
      deTime: '17:00',
      glAmount: 25000.0,
      salesTaxExtractAmount: 25000.0,
      amountToAdjust: 500.0,
      manualAdjustment: 0,
      useTax: 0,
      nonMonthlyCarriedForwardPrior: 0,
      nonMonthlyCarriedForwardFuture: 0,
      creditsCarriedForwardPrior: 0,
      creditsCarriedForwardFuture: 0,
      localAdjustment: 0,
      grossDue: 25500.0,
      prepaymentCredit: 0,
      prepaymentDue: 0,
      vendorsDiscount: 0,
      businessAndOccupationTax: 0,
      rounding: 0,
      currencyConverted: 0,
      netDue: 25500.0,
      currencyCode: 'USD',
      amountToFund: 25500.0,
      statusConfirmationNumber: 'Pending',
      paymentConfirmationNumber: '',
      paymentAmount: 0,
      filingDate: '',
      paymentDate: '',
      clientComment: '',
      dstaxComment: 'Pending review',
      isActive: true,
    },
  ]

  const colHeaders = [
    'Client',
    'Legal Entity',
    'Jurisdiction',
    'Tax Type',
    'Filing Frequency',
    'Filing Method',
    'Due Date',
    'De Time',
    'G/L Amount',
    'Sales Tax Extract Amount',
    'Amount to Adjust',
    'Manual Adjustment (Client Provided)',
    'Use Tax (Sales & Use Tax Extract)',
    'Non-Monthly Return Carried Forward from Prior Periods',
    'Non-Monthly Return Carried Forward to Future Prior Periods',
    'Credits Carried Forward from Prior Periods',
    'Credits Carried Forward to Future Periods',
    'Local Adjustment',
    'Gross Due',
    'Prepayment Credit',
    'Prepayment Due',
    "Vendor's Discount",
    'Business & Occupation Tax',
    'Rounding',
    'Currency Converted',
    'Net Due',
    'Currency Code',
    'Amount to Fund',
    'Status/Confirmation Number',
    'Payment Confirmation Number',
    'Payment Amount',
    'Filing Date',
    'Payment Date',
    'Client Comment',
    'DSTax Comment',
    'Active?',
  ]

  const columns: CustomColumnSettings[] = [
    { data: 'client', type: 'text' },
    { data: 'legalEntity', type: 'text' },
    { data: 'jurisdiction', type: 'text' },
    {
      data: 'taxType',
      type: 'dropdown' as const,
      source: ['Sales Tax', 'Use Tax', 'VAT', 'GST'],
    },
    {
      data: 'filingFrequency',
      type: 'dropdown' as const,
      source: ['Monthly', 'Quarterly', 'Annual'],
    },
    { data: 'filingMethod', type: 'text' },
    {
      data: 'dueDate',
      type: 'intl-date' as const,
      dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
    },
    {
      data: 'deTime',
      type: 'intl-time' as const,
      timeFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
    },
    {
      data: 'glAmount',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'salesTaxExtractAmount',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'amountToAdjust',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'manualAdjustment',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'useTax',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'nonMonthlyCarriedForwardPrior',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'nonMonthlyCarriedForwardFuture',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'creditsCarriedForwardPrior',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'creditsCarriedForwardFuture',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'localAdjustment',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'grossDue',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'prepaymentCredit',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'prepaymentDue',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'vendorsDiscount',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'businessAndOccupationTax',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'rounding',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'currencyConverted',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'netDue',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    { data: 'currencyCode', type: 'text' },
    {
      data: 'amountToFund',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    { data: 'statusConfirmationNumber', type: 'text' },
    { data: 'paymentConfirmationNumber', type: 'text' },
    {
      data: 'paymentAmount',
      type: 'numeric' as const,
      numericFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      },
    },
    {
      data: 'filingDate',
      type: 'intl-date' as const,
      dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
    },
    {
      data: 'paymentDate',
      type: 'intl-date' as const,
      dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
    },
    { data: 'clientComment', type: 'text' },
    { data: 'dstaxComment', type: 'text' },
    { data: 'isActive', type: 'checkbox' },
  ]

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
      <CommonSpreadsheet
        data={data}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders={true}
        onCellEdit={handleCellEdit}
      />
    </div>
  )
}
