import { fetchPreparers } from '@/api/clients-api'
import { PreparerParams } from '@/types/dstax-preparer'
import { useQuery } from '@tanstack/react-query'

export const usePreparers = (params: PreparerParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['dstax-preparers', params],
    queryFn: () => fetchPreparers(params),
  })

  return { data, ...rest }
}
