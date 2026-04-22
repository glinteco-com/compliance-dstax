import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
  state?: string
  legal_entity?: string
}

const CREDIT_BASE = '/api/tax-compliance/credit-carryforwards/'

async function fetchCreditList(
  params: CreditListParams
): Promise<PaginatedCreditList> {
  const searchParams = new URLSearchParams()
  if (params.page != null) searchParams.set('page', String(params.page))
  if (params.page_size != null)
    searchParams.set('page_size', String(params.page_size))
  if (params.search) searchParams.set('search', params.search)
  if (params.state) searchParams.set('state', params.state)
  if (params.legal_entity) searchParams.set('legal_entity', params.legal_entity)
  const response = await fetch(`${CREDIT_BASE}?${searchParams}`)
  if (!response.ok)
    throw new Error('Failed to fetch credit carryforward records')
  return response.json()
}

export const useCreditCarryforwards = (params: CreditListParams) => {
  return useQuery<PaginatedCreditList>({
    queryKey: ['credit-carryforwards', params],
    queryFn: () => fetchCreditList(params),
  })
}

export const useCreditCarryforwardCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<CreditCarryforward, 'id'>) => {
      const response = await fetch(CREDIT_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to create credit carryforward')
      return response.json() as Promise<CreditCarryforward>
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
      const response = await fetch(`${CREDIT_BASE}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to update credit carryforward')
      return response.json() as Promise<CreditCarryforward>
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
      const response = await fetch(`${CREDIT_BASE}${id}/`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete credit carryforward')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-carryforwards'] })
    },
  })
}
