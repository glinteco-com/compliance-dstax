import { useApiCoreUserList } from '@/api/generated/core-user/core-user'
import { ApiCoreUserListParams } from '@/models/apiCoreUserListParams'
import { PaginatedUserList } from '@/models/paginatedUserList'

import { ApiCoreUserListRole } from '@/models/apiCoreUserListRole'

interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  role?: string
  managedClientId?: number
  assignedLegalEntityId?: number
}

export const useUsers = (params: PaginationParams) => {
  const apiParams: ApiCoreUserListParams & { search?: string } = {
    page: params.page,
    page_size: params.pageSize,
    ...(params.role && { role: params.role as ApiCoreUserListRole }),
    ...(params.search && { search: params.search }),
    ...(params.managedClientId && { managed_client: params.managedClientId }),
    ...(params.assignedLegalEntityId && {
      assigned_legal_entities: [params.assignedLegalEntityId],
    }),
  }
  const { data, ...rest } = useApiCoreUserList(apiParams as any)

  return { data: data as unknown as PaginatedUserList, ...rest }
}
