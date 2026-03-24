import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import { LegalEntityParams } from '@/types/legal-entity'

export const useLegalEntities = (params: LegalEntityParams) => {
  const { data, ...rest } = useApiCoreLegalEntityList(params as any)

  const paginatedData = data as unknown as { count: number; results: any[] }

  return {
    data: paginatedData,
    ...rest,
  }
}
