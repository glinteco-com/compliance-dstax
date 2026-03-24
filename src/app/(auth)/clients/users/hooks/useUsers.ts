import { useApiCoreUserList } from '@/api/generated/core-user/core-user'
import { UserParams } from '@/types/user'

export const useUsers = (params: UserParams) => {
  const { data, ...rest } = useApiCoreUserList(params as any)

  const paginatedData = data as unknown as { count: number; results: any[] }

  return { data: paginatedData, ...rest }
}
