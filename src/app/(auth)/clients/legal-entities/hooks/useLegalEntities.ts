import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import { ApiCoreLegalEntityListParams } from '@/models/apiCoreLegalEntityListParams'
import { PaginatedLegalEntityList } from '@/models/paginatedLegalEntityList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  clientId?: number
}

export const useLegalEntities = (params: PaginationParams) => {
  const apiParams: ApiCoreLegalEntityListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
    client: params.clientId,
  }
  const { data, ...rest } = useApiCoreLegalEntityList(apiParams)

  return { data: data as unknown as PaginatedLegalEntityList, ...rest }
}
