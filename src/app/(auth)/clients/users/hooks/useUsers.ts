import { fetchUsers } from '@/api/clients-api'
import { UserParams } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

export const useUsers = (params: UserParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  })

  return { data, ...rest }
}
