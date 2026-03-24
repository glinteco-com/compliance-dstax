import { useApiTaxCompliancePrepaymentMethodsList } from '@/api/generated/tax-compliance-prepayment-method/tax-compliance-prepayment-method'
import { ApiTaxCompliancePrepaymentMethodsListParams } from '@/models/apiTaxCompliancePrepaymentMethodsListParams'
import { PrepaymentMethod } from '@/models/prepaymentMethod'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const usePrepaymentMethods = (params: PaginationParams) => {
  const apiParams: ApiTaxCompliancePrepaymentMethodsListParams = {
    method_description__icontains: params.search,
  }
  const { data, ...rest } = useApiTaxCompliancePrepaymentMethodsList({
    ...apiParams,
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  } as any)

  const paginatedData = data as unknown as {
    count: number
    results: PrepaymentMethod[]
  }

  return { data: paginatedData, ...rest }
}
