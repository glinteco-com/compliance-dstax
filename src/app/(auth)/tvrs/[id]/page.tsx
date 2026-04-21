'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SpreadsheetGrid } from '@/components/spreadsheet/SpreadsheetGrid'
import { CommonSelect } from '@/components/select/CommonSelect'
import { toast } from 'sonner'
import {
  useApiTaxComplianceTvrRecordList,
  useApiTaxComplianceTvrRecordMarkPreparedCreate,
  useApiTaxComplianceTvrRecordAddDstaxCommentsCreate,
  useApiTaxComplianceTvrRecordAddClientCommentsCreate,
} from '@/api/generated/tax-compliance-tvr-record/tax-compliance-tvr-record'
import {
  useApiTaxComplianceTvrPeriodPublishCreate,
  useApiTaxComplianceTvrPeriodFundingReceivedCreate,
} from '@/api/generated/tax-compliance-tvr-period/tax-compliance-tvr-period'
import type { TVRRecord } from '@/models'
import { tvrGridColumns, useTvrColumns } from '../hooks/useTvrColumns'
import { useSessionStore } from '@/store/useSessionStore'
import { useTvrPeriodStore } from '@/store/useTvrPeriodStore'
import { BackButton } from '@/components/button/BackButton'
import { PanelRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEfileRecords } from '../efile/hooks/useEfileRecords'
import { useCreditCarryforwards } from '../credit-carryforwards/hooks/useCreditCarryforwards'

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
}

const fieldToColumnMap: Record<string, string> = Object.fromEntries(
  Object.entries(reverseFieldMap).map(([colId, apiField]) => [apiField, colId])
)

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
  const searchParams = useSearchParams()
  const legalEntityId = searchParams.get('legalEntityId')
    ? Number(searchParams.get('legalEntityId'))
    : undefined

  const { data, isLoading, refetch } = useApiTaxComplianceTvrRecordList({
    period: Number(params.id),
    page_size: 1000,
    legal_entity: legalEntityId,
  })

  const { mutateAsync: markPrepared } =
    useApiTaxComplianceTvrRecordMarkPreparedCreate()
  const { mutateAsync: addDstaxComments } =
    useApiTaxComplianceTvrRecordAddDstaxCommentsCreate()
  const { mutateAsync: addClientComments } =
    useApiTaxComplianceTvrRecordAddClientCommentsCreate()
  const { mutateAsync: publishPeriod } =
    useApiTaxComplianceTvrPeriodPublishCreate()
  const { mutateAsync: fundingReceived } =
    useApiTaxComplianceTvrPeriodFundingReceivedCreate()

  const userRole = useSessionStore((state) => state.user?.role)
  const selectedPeriod = useTvrPeriodStore((state) => state.selectedPeriod)
  const isPublished = selectedPeriod?.workflow_status === 'PUBLISHED'

  const { visibleColumns, allowedEditableCols } = useTvrColumns(userRole)

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
  const [isPublishing, setIsPublishing] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isFundingReceiving, setIsFundingReceiving] = useState(false)
  const [errorCells, setErrorCells] = useState<Map<string, Set<string>>>(
    new Map()
  )

  const [filterLegalEntity, setFilterLegalEntity] = useState('all')

  useEffect(() => {
    if (legalEntityId && records.length > 0) {
      const match = records.find(
        (r) => (r.legal_entity as any)?.id === legalEntityId
      )
      if (match?.legal_entity?.name) {
        setFilterLegalEntity(match.legal_entity.name)
      }
    }
  }, [legalEntityId, records])
  const [filterJurisdiction, setFilterJurisdiction] = useState('all')
  const [filterTaxType, setFilterTaxType] = useState('all')
  const [filterFilingFrequency, setFilterFilingFrequency] = useState('all')
  const [filterFilingType, setFilterFilingType] = useState('all')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data: efileData } = useEfileRecords({ page_size: 100 })
  const { data: creditData } = useCreditCarryforwards({ page_size: 100 })

  const efileRows = efileData?.results ?? []
  const creditRows = creditData?.results ?? []

  const filterOptions = useMemo(() => {
    const unique = (arr: string[]) =>
      Array.from(new Set(arr.filter(Boolean))).map((v) => ({
        value: v,
        label: v,
      }))
    return {
      legalEntities: [
        { value: 'all', label: 'All Legal Entities' },
        ...unique(rows.map((r) => r.legalEntity)),
      ],
      jurisdictions: [
        { value: 'all', label: 'All Jurisdictions' },
        ...unique(rows.map((r) => r.jurisdiction)),
      ],
      taxTypes: [
        { value: 'all', label: 'All Tax Types' },
        ...unique(rows.map((r) => r.taxType)),
      ],
      filingFrequencies: [
        { value: 'all', label: 'All Filing Frequencies' },
        ...unique(rows.map((r) => r.filingFrequency)),
      ],
      filingTypes: [
        { value: 'all', label: 'All Filing Types' },
        ...unique(rows.map((r) => r.filingMethod)),
      ],
    }
  }, [rows])

  const allRecordsReady = useMemo(
    () => rows.length > 0 && rows.every((r) => r.isActive === true),
    [rows]
  )

  const handleCellChange = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const row = rows[rowIndex]
      if (!row) return
      setLocalEdits((prev) => ({
        ...prev,
        [row.id]: { ...prev[row.id], [columnId]: value },
      }))
      setChangedRowIds((ids) => new Set(ids).add(row.id))
      setErrorCells((prev) => {
        const rowErrors = prev.get(row.id)
        if (!rowErrors) return prev
        const next = new Map(prev)
        const updated = new Set(rowErrors)
        updated.delete(columnId)
        if (updated.size === 0) {
          next.delete(row.id)
        } else {
          next.set(row.id, updated)
        }
        return next
      })
    },
    [rows]
  )

  const getApiErrorMessages = useCallback((error: any): string[] => {
    const errorData = error?.response?.data
    if (
      errorData?.type === 'validation_error' &&
      Array.isArray(errorData.errors)
    ) {
      return errorData.errors.map((err: any) => {
        const colId = fieldToColumnMap[err.attr] ?? err.attr
        const label =
          tvrGridColumns.find((c) => c.id === colId)?.label || err.attr
        if (
          err.code === 'required' ||
          err.code === 'blank' ||
          err.code === 'null'
        ) {
          return `${label}: Missing input`
        }
        if (err.code === 'invalid' || err.code === 'invalid_type') {
          return `${label}: Invalid type`
        }
        return `${label}: Invalid input`
      })
    }
    if (typeof errorData?.detail === 'string') return [errorData.detail]
    if (typeof errorData?.message === 'string') return [errorData.message]
    return [error?.message || 'An unexpected error occurred. Please try again.']
  }, [])

  const buildPreparePayload = useCallback(
    (id: string) => {
      const original = records.find((r) => String(r.id) === id)
      if (!original) return null
      const edits = localEdits[id] || {}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_ready, isActive, ...rest } = original as any
      const item: any = { ...rest }
      delete item.is_ready
      delete item.isActive
      for (const [key, value] of Object.entries(edits)) {
        if (key === 'isActive' || key === 'is_ready') continue
        const apiField = reverseFieldMap[key]
        if (apiField) {
          if (numFields.has(apiField)) {
            if (value === '' || value === null || value === undefined) {
              item[apiField] = null
            } else {
              const num = Number(value)
              item[apiField] = isNaN(num) ? value : num.toFixed(2)
            }
          } else if (dateFields.has(apiField)) {
            item[apiField] = value === '' || value === null ? null : value
          } else {
            item[apiField] = value === '' || value === null ? null : value
          }
        }
      }
      return item
    },
    [records, localEdits]
  )

  const handlePrepare = useCallback(async () => {
    if (changedRowIds.size === 0) {
      toast.info('No changes to submit.')
      return
    }
    setIsPreparing(true)
    try {
      const payload = Array.from(changedRowIds)
        .map(buildPreparePayload)
        .filter(Boolean)
      await markPrepared({ data: payload })
      toast.success(`${changedRowIds.size} row(s) prepared.`)
      setChangedRowIds(new Set())
      setLocalEdits({})
      setErrorCells(new Map())
      refetch()
    } catch (error) {
      const messages = getApiErrorMessages(error)
      messages.forEach((msg) => toast.error(msg))
    } finally {
      setIsPreparing(false)
    }
  }, [
    changedRowIds,
    buildPreparePayload,
    markPrepared,
    getApiErrorMessages,
    refetch,
  ])

  const handlePublish = useCallback(async () => {
    setIsPublishing(true)
    try {
      await publishPeriod({ id: Number(params.id), data: {} as any })
      toast.success('TVR period published.')
      refetch()
    } catch (error) {
      const messages = getApiErrorMessages(error)
      messages.forEach((msg) => toast.error(msg))
    } finally {
      setIsPublishing(false)
    }
  }, [params.id, publishPeriod, getApiErrorMessages, refetch])

  const handleComment = useCallback(async () => {
    if (changedRowIds.size === 0) {
      toast.info('No changes to submit.')
      return
    }
    setIsCommenting(true)
    try {
      if (userRole === 'DSTAX_ADMIN') {
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
      }
      toast.success(`Comments added for ${changedRowIds.size} row(s).`)
      setChangedRowIds(new Set())
      setLocalEdits({})
      setErrorCells(new Map())
      refetch()
    } catch (error) {
      const messages = getApiErrorMessages(error)
      messages.forEach((msg) => toast.error(msg))
    } finally {
      setIsCommenting(false)
    }
  }, [
    changedRowIds,
    localEdits,
    records,
    addDstaxComments,
    addClientComments,
    userRole,
    getApiErrorMessages,
    refetch,
  ])

  const handleFundingReceived = useCallback(async () => {
    setIsFundingReceiving(true)
    try {
      await fundingReceived({ id: Number(params.id), data: {} as any })
      toast.success('Funding received confirmed.')
      refetch()
    } catch (error) {
      const messages = getApiErrorMessages(error)
      messages.forEach((msg) => toast.error(msg))
    } finally {
      setIsFundingReceiving(false)
    }
  }, [params.id, fundingReceived, getApiErrorMessages, refetch])

  const filteredRows = rows.filter((row) => {
    if (filterLegalEntity !== 'all' && row.legalEntity !== filterLegalEntity)
      return false
    if (filterJurisdiction !== 'all' && row.jurisdiction !== filterJurisdiction)
      return false
    if (filterTaxType !== 'all' && row.taxType !== filterTaxType) return false
    if (
      filterFilingFrequency !== 'all' &&
      row.filingFrequency !== filterFilingFrequency
    )
      return false
    if (filterFilingType !== 'all' && row.filingMethod !== filterFilingType)
      return false
    return true
  })

  const gridErrorCells = useMemo(() => {
    const result = new Set<string>()
    filteredRows.forEach((row, index) => {
      const rowErrors = errorCells.get(row.id)
      if (rowErrors) {
        rowErrors.forEach((colId) => result.add(`${index}-${colId}`))
      }
    })
    return result
  }, [filteredRows, errorCells])

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
          <BackButton />

          <h1 className="text-2xl font-bold tracking-tight">
            TVR — {clientName ?? 'Loading...'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            title="Show supplemental info"
          >
            <PanelRight className="h-4 w-4" />
          </Button> */}
          {userRole === 'DSTAX_PREPARER' && (
            <Button
              variant="default"
              onClick={handlePrepare}
              disabled={isPreparing || changedRowIds.size === 0}
            >
              {isPreparing ? 'Preparing...' : 'PREPARED'}
              {changedRowIds.size > 0 && (
                <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                  {changedRowIds.size}
                </span>
              )}
            </Button>
          )}
          {userRole === 'DSTAX_ADMIN' && (
            <Button
              variant="default"
              onClick={handlePublish}
              disabled={isPublishing || !allRecordsReady}
            >
              {isPublishing ? 'Publishing...' : 'PUBLISH'}
            </Button>
          )}
          {(userRole === 'DSTAX_ADMIN' || userRole === 'CLIENT_ADMIN') && (
            <Button
              variant="default"
              onClick={handleComment}
              disabled={isCommenting || changedRowIds.size === 0}
            >
              {isCommenting ? 'Saving...' : 'SAVE COMMENTS'}
              {changedRowIds.size > 0 && (
                <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                  {changedRowIds.size}
                </span>
              )}
            </Button>
          )}
          {userRole === 'DSTAX_ADMIN' && (
            <Button
              variant="outline"
              onClick={handleFundingReceived}
              disabled={isFundingReceiving || !isPublished}
            >
              {isFundingReceiving ? 'Processing...' : 'FUNDING RECEIVED'}
            </Button>
          )}
        </div>
      </div>

      <div className="relative z-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <CommonSelect
          placeholder="All Legal Entities"
          options={filterOptions.legalEntities}
          value={filterLegalEntity}
          onChange={(v) => setFilterLegalEntity(String(v))}
        />
        <CommonSelect
          placeholder="All Jurisdictions"
          options={filterOptions.jurisdictions}
          value={filterJurisdiction}
          onChange={(v) => setFilterJurisdiction(String(v))}
        />
        <CommonSelect
          placeholder="All Tax Types"
          options={filterOptions.taxTypes}
          value={filterTaxType}
          onChange={(v) => setFilterTaxType(String(v))}
        />
        <CommonSelect
          placeholder="All Frequencies"
          options={filterOptions.filingFrequencies}
          value={filterFilingFrequency}
          onChange={(v) => setFilterFilingFrequency(String(v))}
        />
        <CommonSelect
          placeholder="All Filing Types"
          options={filterOptions.filingTypes}
          value={filterFilingType}
          onChange={(v) => setFilterFilingType(String(v))}
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
          errorCells={gridErrorCells}
        />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="right"
          className="w-[480px] overflow-y-auto sm:max-w-[480px]"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>Supplemental Info</SheetTitle>
          </SheetHeader>

          {/* EFILE mini-table */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              EFILE Information
            </h3>
            <div className="rounded-md border bg-white dark:bg-zinc-950">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 text-xs font-semibold">
                      Legal Entity
                    </TableHead>
                    <TableHead className="h-9 text-xs font-semibold">
                      State/Jur.
                    </TableHead>
                    <TableHead className="h-9 text-xs font-semibold">
                      Acct #
                    </TableHead>
                    <TableHead className="h-9 text-xs font-semibold">
                      User
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {efileRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-4 text-center text-xs text-zinc-400"
                      >
                        No EFILE records
                      </TableCell>
                    </TableRow>
                  ) : (
                    efileRows.map((row) => (
                      <TableRow key={row.id} className="h-10">
                        <TableCell className="text-xs">
                          {row.legal_entity}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.state_jurisdiction}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {row.account_number}
                        </TableCell>
                        <TableCell className="text-xs">{row.user}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Credit Carryforwards mini-table */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Credit Carryforwards
            </h3>
            <div className="rounded-md border bg-white dark:bg-zinc-950">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 text-xs font-semibold">
                      Legal Entity
                    </TableHead>
                    <TableHead className="h-9 text-xs font-semibold">
                      State
                    </TableHead>
                    <TableHead className="h-9 text-right text-xs font-semibold">
                      Prior
                    </TableHead>
                    <TableHead className="h-9 text-right text-xs font-semibold">
                      Ending
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-4 text-center text-xs text-zinc-400"
                      >
                        No credit carryforward records
                      </TableCell>
                    </TableRow>
                  ) : (
                    creditRows.map((row) => {
                      const priorNum = parseFloat(row.prior_amount)
                      const endingNum = parseFloat(row.ending_amount)
                      const fmt = (n: number) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(n)
                      return (
                        <TableRow key={row.id} className="h-10">
                          <TableCell className="text-xs">
                            {row.legal_entity}
                          </TableCell>
                          <TableCell className="text-xs">{row.state}</TableCell>
                          <TableCell
                            className={`text-right font-mono text-xs ${priorNum < 0 ? 'text-red-600 dark:text-red-400' : ''}`}
                          >
                            {fmt(priorNum)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono text-xs ${endingNum < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                          >
                            {fmt(endingNum)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
