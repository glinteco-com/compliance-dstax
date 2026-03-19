import apiClient from '@/api/api-client'
import { PaginatedResponse } from '@/types/api'
import { Preparer, PreparerParams } from '@/types/dstax-preparer'
import { LegalEntity, LegalEntityParams } from '@/types/legal-entity'
import { User, UserParams } from '@/types/user'

export const fetchLegalEntities = async (
  params: LegalEntityParams
): Promise<PaginatedResponse<LegalEntity>> => {
  const { data } = await apiClient.get('/legal-entities', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchPreparers = async (
  params: PreparerParams
): Promise<PaginatedResponse<Preparer>> => {
  const { data } = await apiClient.get('/dstax-preparers', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchUsers = async (
  params: UserParams
): Promise<PaginatedResponse<User>> => {
  const { data } = await apiClient.get('/users', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}
