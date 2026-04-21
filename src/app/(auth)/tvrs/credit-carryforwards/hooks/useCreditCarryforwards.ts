import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/api-client'

export interface CreditCarryforward {
  id: number
  legal_entity: string
  state: string
  prior_amount: string
  ending_amount: string
}

interface PaginatedCreditList {
  count: number
  results: CreditCarryforward[]
}

interface CreditListParams {
  page?: number
  page_size?: number
  search?: string
}

const CREDIT_BASE = '/api/tax-compliance/credit-carryforwards/'

export const useCreditCarryforwards = (params: CreditListParams) => {
  return useQuery<PaginatedCreditList>({
    queryKey: ['credit-carryforwards', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedCreditList>(CREDIT_BASE, {
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

export const useCreditCarryforwardCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<CreditCarryforward, 'id'>) => {
      const { data } = await apiClient.post<CreditCarryforward>(
        CREDIT_BASE,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-carryforwards'] })
    },
  })
}

export const useCreditCarryforwardUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: Omit<CreditCarryforward, 'id'>
    }) => {
      const { data } = await apiClient.patch<CreditCarryforward>(
        `${CREDIT_BASE}${id}/`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-carryforwards'] })
    },
  })
}

export const useCreditCarryforwardDelete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`${CREDIT_BASE}${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-carryforwards'] })
    },
  })
}
