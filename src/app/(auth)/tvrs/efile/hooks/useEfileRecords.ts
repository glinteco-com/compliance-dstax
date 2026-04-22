import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
  state_jurisdiction?: string
  legal_entity?: string
}

const EFILE_BASE = '/api/tax-compliance/efile/'

const efileQueryKey = (params?: EfileListParams) =>
  ['efile-records', params] as const

async function fetchEfileList(
  params: EfileListParams
): Promise<PaginatedEfileList> {
  const searchParams = new URLSearchParams()
  if (params.page != null) searchParams.set('page', String(params.page))
  if (params.page_size != null)
    searchParams.set('page_size', String(params.page_size))
  if (params.search) searchParams.set('search', params.search)
  if (params.state_jurisdiction)
    searchParams.set('state_jurisdiction', params.state_jurisdiction)
  if (params.legal_entity) searchParams.set('legal_entity', params.legal_entity)
  const response = await fetch(`${EFILE_BASE}?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch EFILE records')
  return response.json()
}

export const useEfileRecords = (params: EfileListParams) => {
  return useQuery<PaginatedEfileList>({
    queryKey: efileQueryKey(params),
    queryFn: () => fetchEfileList(params),
  })
}

export const useEfileRecordCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<EfileRecord, 'id'>) => {
      const response = await fetch(EFILE_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to create EFILE record')
      return response.json() as Promise<EfileRecord>
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
      const response = await fetch(`${EFILE_BASE}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to update EFILE record')
      return response.json() as Promise<EfileRecord>
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
      const response = await fetch(`${EFILE_BASE}${id}/`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete EFILE record')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['efile-records'] })
    },
  })
}
