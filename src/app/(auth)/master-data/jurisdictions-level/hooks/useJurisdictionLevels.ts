import { useApiTaxComplianceJurisdictionLevelList } from '@/api/generated/tax-compliance-jurisdiction-level/tax-compliance-jurisdiction-level'
import { ApiTaxComplianceJurisdictionLevelListParams } from '@/models/apiTaxComplianceJurisdictionLevelListParams'
import { JurisdictionLevel } from '@/models/jurisdictionLevel'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useJurisdictionLevels = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceJurisdictionLevelListParams = {
    name__icontains: params.search,
  }
  const { data, ...rest } = useApiTaxComplianceJurisdictionLevelList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  } as any)

  const paginatedData = data as unknown as {
    count: number
    results: JurisdictionLevel[]
  }

  return { data: paginatedData, ...rest }
}
