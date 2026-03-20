import { fetchJurisdictionLevels } from '@/api/master-data-api'
import { JurisdictionLevelParams } from '@/types/jurisdiction-level'
import { useQuery } from '@tanstack/react-query'

export const useJurisdictionLevels = (params: JurisdictionLevelParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['jurisdiction-levels', params],
    queryFn: () => fetchJurisdictionLevels(params),
  })

  return { data, ...rest }
}
