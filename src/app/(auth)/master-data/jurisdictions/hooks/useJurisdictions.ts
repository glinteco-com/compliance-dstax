import { fetchJurisdictions } from '@/api/master-data-api'
import { JurisdictionParams } from '@/types/jurisdictions'
import { useQuery } from '@tanstack/react-query'

export const useJurisdictions = (params: JurisdictionParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['jurisdictions', params],
    queryFn: () => fetchJurisdictions(params),
  })

  return { data, ...rest }
}
