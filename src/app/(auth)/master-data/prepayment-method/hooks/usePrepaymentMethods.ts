import { fetchPrepaymentMethods } from '@/api/master-data-api'
import { PrepaymentMethodParams } from '@/types/prepayment-method'
import { useQuery } from '@tanstack/react-query'

export const usePrepaymentMethods = (params: PrepaymentMethodParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['prepayment-methods', params],
    queryFn: () => fetchPrepaymentMethods(params),
  })

  return { data, ...rest }
}
