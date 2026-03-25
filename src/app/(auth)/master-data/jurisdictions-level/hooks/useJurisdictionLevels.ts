import { useApiTaxComplianceJurisdictionLevelList } from '@/api/generated/tax-compliance-jurisdiction-level/tax-compliance-jurisdiction-level'
import { ApiTaxComplianceJurisdictionLevelListParams } from '@/models/apiTaxComplianceJurisdictionLevelListParams'
import { PaginatedJurisdictionLevelList } from '@/models/paginatedJurisdictionLevelList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useJurisdictionLevels = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceJurisdictionLevelListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxComplianceJurisdictionLevelList(apiParams)

  return {
    data: data as unknown as PaginatedJurisdictionLevelList,
    ...rest,
  }
}
