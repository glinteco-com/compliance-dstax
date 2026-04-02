import { useMemo } from 'react'
import type { SpreadsheetColumn } from '@/components/spreadsheet/SpreadsheetGrid'

const currencyCol = (id: string, label: string): SpreadsheetColumn => ({
  id,
  label,
  type: 'currency',
  width: 160,
})

export const tvrGridColumns: SpreadsheetColumn[] = [
  { id: 'legalEntity', label: 'Legal Entity', width: 180, readOnly: true },
  { id: 'jurisdiction', label: 'Jurisdiction', width: 110, readOnly: true },
  { id: 'taxType', label: 'Tax Type', width: 120 },
  { id: 'filingFrequency', label: 'Filing Frequency', width: 140 },
  { id: 'filingMethod', label: 'Filing Method', width: 120 },
  { id: 'dueDate', label: 'Due Date', type: 'date', width: 120 },
  { id: 'deTime', label: 'De Time', width: 100 },
  currencyCol('glAmount', 'G/L Amount'),
  currencyCol('salesTaxExtractAmount', 'Sales Tax Extract Amount'),
  currencyCol('amountToAdjust', 'Amount to Adjust'),
  currencyCol('manualAdjustment', 'Manual Adjustment (Client Provided)'),
  currencyCol('useTax', 'Use Tax (Sales & Use Tax Extract)'),
  currencyCol(
    'nonMonthlyCarriedForwardPrior',
    'Non-Monthly CF from Prior Periods'
  ),
  currencyCol(
    'nonMonthlyCarriedForwardFuture',
    'Non-Monthly CF to Future Periods'
  ),
  currencyCol('creditsCarriedForwardPrior', 'Credits CF from Prior Periods'),
  currencyCol('creditsCarriedForwardFuture', 'Credits CF to Future Periods'),
  currencyCol('localAdjustment', 'Local Adjustment'),
  currencyCol('grossDue', 'Gross Due'),
  currencyCol('prepaymentCredit', 'Prepayment Credit'),
  currencyCol('prepaymentDue', 'Prepayment Due'),
  currencyCol('vendorsDiscount', "Vendor's Discount"),
  currencyCol('businessAndOccupationTax', 'Business & Occupation Tax'),
  currencyCol('rounding', 'Rounding'),
  currencyCol('currencyConverted', 'Currency Converted'),
  currencyCol('netDue', 'Net Due'),
  { id: 'currencyCode', label: 'Currency Code', width: 120 },
  currencyCol('amountToFund', 'Amount to Fund'),
  {
    id: 'statusConfirmationNumber',
    label: 'Status/Confirmation #',
    width: 180,
  },
  {
    id: 'paymentConfirmationNumber',
    label: 'Payment Confirmation #',
    width: 180,
  },
  currencyCol('paymentAmount', 'Payment Amount'),
  { id: 'filingDate', label: 'Filing Date', type: 'date', width: 120 },
  { id: 'paymentDate', label: 'Payment Date', type: 'date', width: 120 },
  { id: 'clientComment', label: 'Client Comment', width: 200 },
  { id: 'dstaxComment', label: 'DSTax Comment', width: 200 },
  {
    id: 'isActive',
    label: 'Active?',
    type: 'checkbox',
    width: 80,
    align: 'center',
  },
]

const preparerEditableCols: string[] = [
  'glAmount',
  'salesTaxExtractAmount',
  'manualAdjustment',
  'useTax',
  'creditsCarriedForwardPrior',
  'creditsCarriedForwardFuture',
  'localAdjustment',
  'prepaymentDue',
  'vendorsDiscount',
  'businessAndOccupationTax',
  'rounding',
  'currencyConverted',
  'statusConfirmationNumber',
  'paymentConfirmationNumber',
  'paymentAmount',
  'filingDate',
  'paymentDate',
  'isActive',
]

type UserRole =
  | 'DSTAX_PREPARER'
  | 'DSTAX_ADMIN'
  | 'CLIENT_ADMIN'
  | string
  | undefined

export function useTvrColumns(userRole: UserRole) {
  const visibleColumns = useMemo(
    () =>
      tvrGridColumns
        .filter((col) => {
          if (col.id === 'clientComment' || col.id === 'dstaxComment') {
            return (
              userRole === 'DSTAX_PREPARER' ||
              userRole === 'DSTAX_ADMIN' ||
              userRole === 'CLIENT_ADMIN'
            )
          }
          return true
        })
        .map((col) => {
          if (col.id === 'dstaxComment') {
            return { ...col, readOnly: userRole !== 'DSTAX_ADMIN' }
          }
          if (col.id === 'clientComment') {
            return { ...col, readOnly: userRole !== 'CLIENT_ADMIN' }
          }
          return col
        }),
    [userRole]
  )

  const allowedEditableCols = useMemo(() => {
    if (userRole === 'DSTAX_PREPARER') return preparerEditableCols
    if (userRole === 'DSTAX_ADMIN') return ['dstaxComment']
    if (userRole === 'CLIENT_ADMIN') return ['clientComment']
    return []
  }, [userRole])

  return { visibleColumns, allowedEditableCols }
}
