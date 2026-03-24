import { useApiTaxComplianceFilingTypeList } from '@/api/generated/tax-compliance-filing-type/tax-compliance-filing-type'
import { ApiTaxComplianceFilingTypeListParams } from '@/models/apiTaxComplianceFilingTypeListParams'
import { FilingType } from '@/models/filingType'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useFilingTypes = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceFilingTypeListParams = {
    name__icontains: params.search,
  }
  const { data, ...rest } = useApiTaxComplianceFilingTypeList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  } as any)

  const paginatedData = data as unknown as {
    count: number
    results: FilingType[]
  }

  return { data: paginatedData, ...rest }
}
