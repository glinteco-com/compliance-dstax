'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SpreadsheetGrid } from '@/components/spreadsheet/SpreadsheetGrid'
import { CommonSelect } from '@/components/select/CommonSelect'
import { ArrowLeft } from 'lucide-react'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import { toast } from 'sonner'
import {
  mockClients,
  mockTvrData,
  getFilterOptions,
  gridColumns,
  editableTvrColumns,
} from '../mock-data'

export default function TVRDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const client = mockClients.find((c) => c.id === params.id)
  const [rows, setRows] = useState(mockTvrData[params.id] || [])
  const [changedRowIds, setChangedRowIds] = useState<Set<string>>(new Set())
  const [isPreparing, setIsPreparing] = useState(false)
  const filterOptions = getFilterOptions(rows)

  const [filterLegalEntity, setFilterLegalEntity] = useState('')
  const [filterJurisdiction, setFilterJurisdiction] = useState('')
  const [filterTaxType, setFilterTaxType] = useState('')
  const [filterFilingFrequency, setFilterFilingFrequency] = useState('')
  const [filterFilingType, setFilterFilingType] = useState('')

  const handleCellChange = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      setRows((prev) => {
        const next = [...prev]
        const row = next[rowIndex]
        next[rowIndex] = { ...row, [columnId]: value }
        setChangedRowIds((ids) => new Set(ids).add(row.id))
        return next
      })
    },
    []
  )

  const handlePrepared = useCallback(async () => {
    if (changedRowIds.size === 0) {
      toast.info('No changes to submit.')
      return
    }
    setIsPreparing(true)
    const changedRows = rows.filter((r) => changedRowIds.has(r.id))
    // Mock API call — log changed row IDs and data
    console.log(
      'Submitting prepared rows:',
      changedRows.map((r) => ({ id: r.id }))
    )
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success(`${changedRows.length} row(s) marked as prepared.`)
    setChangedRowIds(new Set())
    setIsPreparing(false)
  }, [changedRowIds, rows])

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

  if (!client) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
        <p className="text-zinc-500">Client not found</p>
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
            TVR — {client.clientName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={handlePrepared}
            disabled={isPreparing || changedRowIds.size === 0}
          >
            {isPreparing ? 'Submitting...' : 'PREPARED'}
            {changedRowIds.size > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                {changedRowIds.size}
              </span>
            )}
          </Button>
          {/* <Button variant="secondary">REVIEW COMMENTS</Button>
          <Button variant="outline">PUBLISH RETURNS</Button>
          <Button variant="default">FUNDING RECEIVED</Button> */}
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
          columns={gridColumns}
          data={filteredRows}
          editableColumns={editableTvrColumns}
          onChange={handleCellChange}
          className="h-full w-full"
          emptyMessage="No tax records match the current filters."
        />
      </div>
    </div>
  )
}
