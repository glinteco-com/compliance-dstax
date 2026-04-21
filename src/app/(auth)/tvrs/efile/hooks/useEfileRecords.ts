import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/api-client'

export interface EfileRecord {
  id: number
  legal_entity: string
  state_jurisdiction: string
  account_number: string
  user: string
}

interface PaginatedEfileList {
  count: number
  results: EfileRecord[]
}

interface EfileListParams {
  page?: number
  page_size?: number
  search?: string
}

const EFILE_BASE = '/api/tax-compliance/efile/'

const efileQueryKey = (params?: EfileListParams) =>
  ['efile-records', params] as const

export const useEfileRecords = (params: EfileListParams) => {
  return useQuery<PaginatedEfileList>({
    queryKey: efileQueryKey(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedEfileList>(EFILE_BASE, {
        params: {
          page: params.page,
          page_size: params.page_size,
          search: params.search,
        },
      })
      return data
    },
  })
}

export const useEfileRecordCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<EfileRecord, 'id'>) => {
      const { data } = await apiClient.post<EfileRecord>(EFILE_BASE, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['efile-records'] })
    },
  })
}

export const useEfileRecordUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: Omit<EfileRecord, 'id'>
    }) => {
      const { data } = await apiClient.patch<EfileRecord>(
        `${EFILE_BASE}${id}/`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['efile-records'] })
    },
  })
}

export const useEfileRecordDelete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`${EFILE_BASE}${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['efile-records'] })
    },
  })
}
