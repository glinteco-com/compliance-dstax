import { useApiTaxComplianceFilingTypeList } from '@/api/generated/tax-compliance-filing-type/tax-compliance-filing-type'
import { ApiTaxComplianceFilingTypeListParams } from '@/models/apiTaxComplianceFilingTypeListParams'
import { PaginatedFilingTypeList } from '@/models/paginatedFilingTypeList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useFilingTypes = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceFilingTypeListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxComplianceFilingTypeList(apiParams)

  return { data: data as unknown as PaginatedFilingTypeList, ...rest }
}
