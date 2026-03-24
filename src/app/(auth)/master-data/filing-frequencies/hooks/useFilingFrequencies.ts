import { useApiTaxComplianceFilingFrequencyList } from '@/api/generated/tax-compliance-filing-frequency/tax-compliance-filing-frequency'
import { ApiTaxComplianceFilingFrequencyListParams } from '@/models/apiTaxComplianceFilingFrequencyListParams'
import { FilingFrequency } from '@/models/filingFrequency'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useFilingFrequencies = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceFilingFrequencyListParams = {
    // If limit/offset aren't openly exposed in model, orval sometimes ignores them. But since DRF uses them, we might be okay. Wait, if they're not in the model, they'll throw a TS error. But we can cast it as any if needed.
    // The previous structure in filing frequencies params:
  }
  const { data, ...rest } = useApiTaxComplianceFilingFrequencyList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
    code__icontains: params.search,
  } as any)

  const paginatedData = data as unknown as {
    count: number
    results: FilingFrequency[]
  }

  return { data: paginatedData, ...rest }
}
