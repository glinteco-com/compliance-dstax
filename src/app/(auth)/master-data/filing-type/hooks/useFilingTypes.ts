import { fetchFilingTypes } from '@/api/master-data-api'
import { FilingTypeParams } from '@/types/filing-type'
import { useQuery } from '@tanstack/react-query'

export const useFilingTypes = (params: FilingTypeParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['filing-types', params],
    queryFn: () => fetchFilingTypes(params),
  })

  return { data, ...rest }
}
