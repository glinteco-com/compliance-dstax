import { useApiTaxComplianceJurisdictionList } from '@/api/generated/tax-compliance-jurisdiction/tax-compliance-jurisdiction'
import { ApiTaxComplianceJurisdictionListParams } from '@/models/apiTaxComplianceJurisdictionListParams'
import { Jurisdiction } from '@/models/jurisdiction'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useJurisdictions = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceJurisdictionListParams = {
    name__icontains: params.search,
  }
  const { data, ...rest } = useApiTaxComplianceJurisdictionList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  } as any)

  const paginatedData = data as unknown as {
    count: number
    results: Jurisdiction[]
  }

  return { data: paginatedData, ...rest }
}
