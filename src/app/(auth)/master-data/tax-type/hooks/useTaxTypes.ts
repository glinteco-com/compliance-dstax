import { useApiTaxComplianceTaxTypeList } from '@/api/generated/tax-compliance-tax-type/tax-compliance-tax-type'
import { ApiTaxComplianceTaxTypeListParams } from '@/models/apiTaxComplianceTaxTypeListParams'
import { PaginatedTaxTypeList } from '@/models/paginatedTaxTypeList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useTaxTypes = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceTaxTypeListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxComplianceTaxTypeList(apiParams)

  return { data: data as unknown as PaginatedTaxTypeList, ...rest }
}
