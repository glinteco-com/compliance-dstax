'use client'

import { useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SpreadsheetGrid } from '@/components/spreadsheet/SpreadsheetGrid'
import { CommonSelect } from '@/components/select/CommonSelect'
import { ArrowLeft } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { toast } from 'sonner'
import {
  useApiTaxComplianceTvrRecordList,
  useApiTaxComplianceTvrRecordUpdate,
  useApiTaxComplianceTvrRecordAddDstaxCommentsCreate,
  useApiTaxComplianceTvrRecordAddClientCommentsCreate,
} from '@/api/generated/tax-compliance-tvr-record/tax-compliance-tvr-record'
import type { TVRRecord } from '@/models'
import { gridColumns, editableTvrColumns } from '../mock-data'
import { useSessionStore } from '@/store/useSessionStore'

const reverseFieldMap: Record<string, keyof TVRRecord> = {
  glAmount: 'gl_amount',
  salesTaxExtractAmount: 'sales_tax_extract',
  manualAdjustment: 'manual_adjustment',
  useTax: 'use_tax',
  creditsCarriedForwardPrior: 'credits_cf_prior',
  creditsCarriedForwardFuture: 'credits_cf_future',
  localAdjustment: 'local_adjustment',
  prepaymentDue: 'prepayment_due',
  vendorsDiscount: 'vendors_discount',
  businessAndOccupationTax: 'bo_tax',
  rounding: 'rounding',
  currencyConverted: 'currency_converted',
  statusConfirmationNumber: 'status_conf_num',
  paymentConfirmationNumber: 'payment_conf_num',
  paymentAmount: 'payment_amount',
  filingDate: 'filing_date',
  paymentDate: 'payment_date',
  clientComment: 'client_comment',
  dstaxComment: 'dstax_comment',
  isActive: 'is_ready',
}

const requiredFieldsForPreparer = [
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
]

const numFields = new Set([
  'gl_amount',
  'sales_tax_extract',
  'manual_adjustment',
  'use_tax',
  'credits_cf_prior',
  'credits_cf_future',
  'local_adjustment',
  'prepayment_due',
  'vendors_discount',
  'bo_tax',
  'rounding',
  'currency_converted',
  'payment_amount',
])

const dateFields = new Set(['filing_date', 'payment_date'])

export default function TVRDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const { data, isLoading, refetch } = useApiTaxComplianceTvrRecordList({
    period: Number(params.id),
    page_size: 1000,
  })

  const { mutateAsync: updateRecord } = useApiTaxComplianceTvrRecordUpdate()
  const { mutateAsync: addDstaxComments } =
    useApiTaxComplianceTvrRecordAddDstaxCommentsCreate()
  const { mutateAsync: addClientComments } =
    useApiTaxComplianceTvrRecordAddClientCommentsCreate()

  const userRole = useSessionStore((state) => state.user?.role)

  const allowedEditableCols = useMemo(() => {
    if (userRole === 'DSTAX_PREPARER') {
      return editableTvrColumns.filter(
        (col) => col !== 'dstaxComment' && col !== 'clientComment'
      )
    }
    if (userRole === 'DSTAX_ADMIN') {
      return ['dstaxComment']
    }
    if (userRole === 'CLIENT_ADMIN') {
      return ['clientComment']
    }
    return []
  }, [userRole])

  const records = data?.results ?? []

  const clientName = records[0]?.period?.client?.name

  const mapRecord = useCallback(
    (record: TVRRecord) => ({
      id: String(record.id),
      legalEntity: record.legal_entity?.name ?? '',
      jurisdiction: record.jurisdiction?.name ?? '',
      taxType: record.tax_type?.name ?? '',
      filingFrequency: record.filing_frequency?.code ?? '',
      filingMethod: record.filing_method?.name ?? '',
      dueDate: record.jurisdiction?.due_date_time ?? '',
      deTime: '',
      glAmount: record.gl_amount ?? '',
      salesTaxExtractAmount: record.sales_tax_extract ?? '',
      amountToAdjust: record.amount_to_adjust ?? '',
      manualAdjustment: record.manual_adjustment ?? '',
      useTax: record.use_tax ?? '',
      nonMonthlyCarriedForwardPrior: record.nmr_cf_prior ?? '',
      nonMonthlyCarriedForwardFuture: record.nmr_cf_future ?? '',
      creditsCarriedForwardPrior: record.credits_cf_prior ?? '',
      creditsCarriedForwardFuture: record.credits_cf_future ?? '',
      localAdjustment: record.local_adjustment ?? '',
      grossDue: record.gross_due ?? '',
      prepaymentCredit: record.prepayment_credit ?? '',
      prepaymentDue: record.prepayment_due ?? '',
      vendorsDiscount: record.vendors_discount ?? '',
      businessAndOccupationTax: record.bo_tax ?? '',
      rounding: record.rounding ?? '',
      currencyConverted: record.currency_converted ?? '',
      netDue: record.net_due ?? '',
      currencyCode: record.currency_code ?? '',
      amountToFund: record.amount_to_fund ?? '',
      statusConfirmationNumber: record.status_conf_num ?? '',
      paymentConfirmationNumber: record.payment_conf_num ?? '',
      paymentAmount: record.payment_amount ?? '',
      filingDate: record.filing_date ?? '',
      paymentDate: record.payment_date ?? '',
      clientComment: record.client_comment ?? '',
      dstaxComment: record.dstax_comment ?? '',
      isActive: record.is_ready ?? false,
    }),
    []
  )

  const baseRows = useMemo(() => records.map(mapRecord), [records, mapRecord])

  const [localEdits, setLocalEdits] = useState<
    Record<string, Record<string, unknown>>
  >({})

  const rows = useMemo(
    () =>
      baseRows.map((row) => {
        const edits = localEdits[row.id]
        return edits ? { ...row, ...edits } : row
      }),
    [baseRows, localEdits]
  )

  const [changedRowIds, setChangedRowIds] = useState<Set<string>>(new Set())
  const [isPreparing, setIsPreparing] = useState(false)

  const [filterLegalEntity, setFilterLegalEntity] = useState('')
  const [filterJurisdiction, setFilterJurisdiction] = useState('')
  const [filterTaxType, setFilterTaxType] = useState('')
  const [filterFilingFrequency, setFilterFilingFrequency] = useState('')
  const [filterFilingType, setFilterFilingType] = useState('')

  const filterOptions = useMemo(() => {
    const unique = (arr: string[]) =>
      Array.from(new Set(arr.filter(Boolean))).map((v) => ({
        value: v,
        label: v,
      }))
    return {
      legalEntities: unique(rows.map((r) => r.legalEntity)),
      jurisdictions: unique(rows.map((r) => r.jurisdiction)),
      taxTypes: unique(rows.map((r) => r.taxType)),
      filingFrequencies: unique(rows.map((r) => r.filingFrequency)),
      filingTypes: unique(rows.map((r) => r.filingMethod)),
    }
  }, [rows])

  const visibleColumns = useMemo(() => {
    return gridColumns
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
      })
  }, [userRole])

  const handleCellChange = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const row = rows[rowIndex]
      if (!row) return
      setLocalEdits((prev) => ({
        ...prev,
        [row.id]: { ...prev[row.id], [columnId]: value },
      }))
      setChangedRowIds((ids) => new Set(ids).add(row.id))
    },
    [rows]
  )

  const handlePrepared = useCallback(async () => {
    if (changedRowIds.size === 0) {
      toast.info('No changes to submit.')
      return
    }
    setIsPreparing(true)
    try {
      if (userRole === 'DSTAX_PREPARER') {
        const incompleteRows: string[] = []
        const changedIdsArray = Array.from(changedRowIds)

        for (const id of changedIdsArray) {
          const row = rows.find((r) => r.id === id)
          if (!row) continue

          const missingFields = requiredFieldsForPreparer.filter((field) => {
            const val = (row as any)[field]
            return val === '' || val === null || val === undefined
          })

          if (missingFields.length > 0) {
            const fieldLabels = missingFields
              .map((f) => gridColumns.find((c) => c.id === f)?.label || f)
              .join(', ')
            incompleteRows.push(
              `Row ${row.legalEntity} - ${row.jurisdiction}: missing ${fieldLabels}`
            )
          }
        }

        if (incompleteRows.length > 0) {
          toast.error(
            `Please fill in all required fields for edited rows:\n${incompleteRows.join('\n')}`
          )
          setIsPreparing(false)
          return
        }

        const promises = changedIdsArray.map((id) => {
          const original = records.find((r) => String(r.id) === id)
          if (!original) return Promise.resolve()

          const edits = localEdits[id] || {}
          // Explicitly map IDs from original record to avoid missing required fields
          const payload = {
            ...original,
            period_id: (original.period as any)?.id ?? original.period_id,
            legal_entity_id:
              (original.legal_entity as any)?.id ?? original.legal_entity_id,
            jurisdiction_id:
              (original.jurisdiction as any)?.id ?? original.jurisdiction_id,
            filing_frequency_id:
              (original.filing_frequency as any)?.id ??
              original.filing_frequency_id,
            filing_method_id:
              (original.filing_method as any)?.id ?? original.filing_method_id,
          }

          for (const [key, value] of Object.entries(edits)) {
            const apiField = reverseFieldMap[key]
            if (apiField) {
              if (numFields.has(apiField)) {
                if (value === '' || value === null || value === undefined) {
                  ;(payload as any)[apiField] = null
                } else {
                  const num = Number(value)
                  ;(payload as any)[apiField] = isNaN(num)
                    ? null
                    : num.toFixed(2)
                }
              } else if (dateFields.has(apiField)) {
                ;(payload as any)[apiField] =
                  value === '' || value === null ? null : value
              } else {
                ;(payload as any)[apiField] =
                  value === '' || value === null ? null : value
              }
            }
          }
          return updateRecord({ id: Number(id), data: payload as any })
        })
        await Promise.all(promises)
        toast.success(`${changedRowIds.size} row(s) updated and prepared.`)
      } else if (userRole === 'DSTAX_ADMIN') {
        const payload = Array.from(changedRowIds).map((id) => {
          const edits = localEdits[id] || {}
          const original = records.find((r) => String(r.id) === id)
          return {
            id: Number(id),
            dstax_comment:
              (edits.dstaxComment as string) ?? original?.dstax_comment ?? '',
          }
        })
        await addDstaxComments({ data: payload })
        toast.success(`Comments added for ${changedRowIds.size} row(s).`)
      } else if (userRole === 'CLIENT_ADMIN') {
        const payload = Array.from(changedRowIds).map((id) => {
          const edits = localEdits[id] || {}
          const original = records.find((r) => String(r.id) === id)
          return {
            id: Number(id),
            client_comment:
              (edits.clientComment as string) ?? original?.client_comment ?? '',
          }
        })
        await addClientComments({ data: payload })
        toast.success(`Comments added for ${changedRowIds.size} row(s).`)
      }

      setChangedRowIds(new Set())
      setLocalEdits({})
      refetch()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit changes. Please try again.')
    } finally {
      setIsPreparing(false)
    }
  }, [
    changedRowIds,
    rows,
    records,
    localEdits,
    updateRecord,
    addDstaxComments,
    refetch,
    userRole,
  ])

  const filteredRows = rows.filter((row) => {
    if (filterLegalEntity && row.legalEntity !== filterLegalEntity) return false
    if (filterJurisdiction && row.jurisdiction !== filterJurisdiction)
      return false
    if (filterTaxType && row.taxType !== filterTaxType) return false
    if (filterFilingFrequency && row.filingFrequency !== filterFilingFrequency)
      return false
    if (filterFilingType && row.filingMethod !== filterFilingType) return false
    return true
  })

  if (!isLoading && records.length === 0) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
        <p className="text-zinc-500">No records found for this TVR period</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/tvrs')}
        >
          Back to TVRs
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CommonTooltip content="Back to client list">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => router.push('/tvrs')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </CommonTooltip>
          <h1 className="text-2xl font-bold tracking-tight">
            TVR — {clientName ?? 'Loading...'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {(userRole === 'DSTAX_PREPARER' || userRole === 'DSTAX_ADMIN') && (
            <Button
              variant="default"
              onClick={handlePrepared}
              disabled={isPreparing || changedRowIds.size === 0}
            >
              {isPreparing
                ? 'Submitting...'
                : userRole === 'DSTAX_PREPARER'
                  ? 'PREPARED'
                  : 'SAVE CHANGES'}
              {changedRowIds.size > 0 && (
                <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                  {changedRowIds.size}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="relative z-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <CommonSelect
          placeholder="All Legal Entities"
          options={filterOptions.legalEntities}
          value={filterLegalEntity}
          onChange={(v) => setFilterLegalEntity(v)}
        />
        <CommonSelect
          placeholder="All Jurisdictions"
          options={filterOptions.jurisdictions}
          value={filterJurisdiction}
          onChange={(v) => setFilterJurisdiction(v)}
        />
        <CommonSelect
          placeholder="All Tax Types"
          options={filterOptions.taxTypes}
          value={filterTaxType}
          onChange={(v) => setFilterTaxType(v)}
        />
        <CommonSelect
          placeholder="All Frequencies"
          options={filterOptions.filingFrequencies}
          value={filterFilingFrequency}
          onChange={(v) => setFilterFilingFrequency(v)}
        />
        <CommonSelect
          placeholder="All Filing Types"
          options={filterOptions.filingTypes}
          value={filterFilingType}
          onChange={(v) => setFilterFilingType(v)}
        />
      </div>

      <div className="min-h-0 w-full min-w-0 flex-1 overflow-auto">
        <SpreadsheetGrid
          columns={visibleColumns}
          data={filteredRows}
          editableColumns={allowedEditableCols}
          onChange={handleCellChange}
          className="h-full w-full"
          emptyMessage="No tax records match the current filters."
        />
      </div>
    </div>
  )
}
