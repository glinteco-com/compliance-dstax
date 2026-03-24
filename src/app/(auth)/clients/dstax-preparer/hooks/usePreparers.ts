import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { PreparerParams } from '@/types/dstax-preparer'

export const usePreparers = (params: PreparerParams) => {
  const { data, ...rest } = useApiCoreClientList(params as any)

  const paginatedData = data as unknown as { count: number; results: any[] }

  return { data: paginatedData, ...rest }
}
