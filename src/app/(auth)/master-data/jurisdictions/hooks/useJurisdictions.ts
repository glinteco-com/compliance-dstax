import { useApiTaxComplianceJurisdictionList } from '@/api/generated/tax-compliance-jurisdiction/tax-compliance-jurisdiction'
import { ApiTaxComplianceJurisdictionListParams } from '@/models/apiTaxComplianceJurisdictionListParams'
import { PaginatedJurisdictionList } from '@/models/paginatedJurisdictionList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useJurisdictions = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceJurisdictionListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxComplianceJurisdictionList(apiParams)

  return {
    data: data as unknown as PaginatedJurisdictionList,
    ...rest,
  }
}
