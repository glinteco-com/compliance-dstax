'use client'

import { CommonSelect } from '@/components/select/CommonSelect'

interface FilterOption {
  value: string
  label: string
}

interface FilterOptions {
  legalEntities: FilterOption[]
  jurisdictions: FilterOption[]
  taxTypes: FilterOption[]
  filingFrequencies: FilterOption[]
  filingTypes: FilterOption[]
}

interface TVRFiltersProps {
  filterOptions: FilterOptions
  filterLegalEntity: string
  setFilterLegalEntity: (v: string) => void
  filterJurisdiction: string
  setFilterJurisdiction: (v: string) => void
  filterTaxType: string
  setFilterTaxType: (v: string) => void
  filterFilingFrequency: string
  setFilterFilingFrequency: (v: string) => void
  filterFilingType: string
  setFilterFilingType: (v: string) => void
}

export function TVRFilters({
  filterOptions,
  filterLegalEntity,
  setFilterLegalEntity,
  filterJurisdiction,
  setFilterJurisdiction,
  filterTaxType,
  setFilterTaxType,
  filterFilingFrequency,
  setFilterFilingFrequency,
  filterFilingType,
  setFilterFilingType,
}: TVRFiltersProps) {
  return (
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
  )
}
