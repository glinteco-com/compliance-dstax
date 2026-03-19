import { fetchLegalEntities } from '@/api/clients-api'
import { LegalEntityParams } from '@/types/legal-entity'
import { useQuery } from '@tanstack/react-query'

export const useLegalEntities = (params: LegalEntityParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['legal-entities', params],
    queryFn: () => fetchLegalEntities(params),
  })

  return {
    data,
    ...rest,
  }
}
