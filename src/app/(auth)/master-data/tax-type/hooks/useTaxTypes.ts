import { useApiTaxComplianceTaxTypeList } from '@/api/generated/tax-compliance-tax-type/tax-compliance-tax-type'
import { ApiTaxComplianceTaxTypeListParams } from '@/models/apiTaxComplianceTaxTypeListParams'
import { TaxType } from '@/models/taxType'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useTaxTypes = (params: PaginationParams) => {
  const apiParams: ApiTaxComplianceTaxTypeListParams = {
    name__icontains: params.search,
  }
  const { data, ...rest } = useApiTaxComplianceTaxTypeList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  } as any)

  const paginatedData = data as unknown as { count: number; results: TaxType[] }

  return { data: paginatedData, ...rest }
}
