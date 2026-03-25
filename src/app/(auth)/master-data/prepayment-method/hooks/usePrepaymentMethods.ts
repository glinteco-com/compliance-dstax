import { useApiTaxCompliancePrepaymentMethodsList } from '@/api/generated/tax-compliance-prepayment-method/tax-compliance-prepayment-method'
import { ApiTaxCompliancePrepaymentMethodsListParams } from '@/models/apiTaxCompliancePrepaymentMethodsListParams'
import { PaginatedPrepaymentMethodList } from '@/models/paginatedPrepaymentMethodList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const usePrepaymentMethods = (params: PaginationParams) => {
  const apiParams: ApiTaxCompliancePrepaymentMethodsListParams = {
    method_description__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiTaxCompliancePrepaymentMethodsList(apiParams)

  return { data: data as unknown as PaginatedPrepaymentMethodList, ...rest }
}
