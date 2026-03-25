import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { ApiCoreClientListParams } from '@/models/apiCoreClientListParams'
import { PaginatedClientList } from '@/models/paginatedClientList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useClients = (params: PaginationParams) => {
  const apiParams: ApiCoreClientListParams = {
    name__icontains: params.search,
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiCoreClientList(apiParams)

  return { data: data as unknown as PaginatedClientList, ...rest }
}
