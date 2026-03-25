import { useApiCoreUserList } from '@/api/generated/core-user/core-user'
import { ApiCoreUserListParams } from '@/models/apiCoreUserListParams'
import { PaginatedUserList } from '@/models/paginatedUserList'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export const useUsers = (params: PaginationParams) => {
  const apiParams: ApiCoreUserListParams = {
    page: params.page,
    page_size: params.pageSize,
  }
  const { data, ...rest } = useApiCoreUserList(apiParams)

  return { data: data as unknown as PaginatedUserList, ...rest }
}
