import { useApiTaxComplianceFilingFrequencyList } from '@/api/generated/tax-compliance-filing-frequency/tax-compliance-filing-frequency'
import { ApiTaxComplianceFilingFrequencyListParams } from '@/models/apiTaxComplianceFilingFrequencyListParams'
import { PaginatedFilingFrequencyList } from '@/models/paginatedFilingFrequencyList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useFilingFrequencies = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceFilingFrequencyListParams = {
    code__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxComplianceFilingFrequencyList(apiParams)

  return {
    data: data as unknown as PaginatedFilingFrequencyList,
    ...rest,
  }
}
