import { fetchTaxTypes } from '@/api/master-data-api'
import { TaxTypeParams } from '@/types/tax-type'
import { useQuery } from '@tanstack/react-query'

export const useTaxTypes = (params: TaxTypeParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['tax-types', params],
    queryFn: () => fetchTaxTypes(params),
  })

  return { data, ...rest }
}
