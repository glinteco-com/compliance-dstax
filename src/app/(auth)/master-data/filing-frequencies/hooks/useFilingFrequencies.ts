import { fetchFilingFrequencies } from '@/api/master-data-api'
import { FilingFrequencyParams } from '@/types/filing-frequency'
import { useQuery } from '@tanstack/react-query'

export const useFilingFrequencies = (params: FilingFrequencyParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['filing-frequencies', params],
    queryFn: () => fetchFilingFrequencies(params),
  })

  return { data, ...rest }
}
