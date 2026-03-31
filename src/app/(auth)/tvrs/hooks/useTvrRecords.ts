import { useQueryClient } from '@tanstack/react-query'
import {
  getApiTaxComplianceTvrRecordListQueryKey,
  useApiTaxComplianceTvrRecordList,
  useApiTaxComplianceTvrRecordRetrieve,
  useApiTaxComplianceTvrRecordCreate,
  useApiTaxComplianceTvrRecordPartialUpdate,
  useApiTaxComplianceTvrRecordDestroy,
  useApiTaxComplianceTvrRecordAddClientCommentsCreate,
  useApiTaxComplianceTvrRecordAddDstaxCommentsCreate,
  useApiTaxComplianceTvrRecordMarkPreparedCreate,
} from '@/api/generated/tax-compliance-tvr-record/tax-compliance-tvr-record'
import { ApiTaxComplianceTvrRecordListParams } from '@/models/apiTaxComplianceTvrRecordListParams'
import { PaginatedTVRRecordList } from '@/models/paginatedTVRRecordList'

interface TvrRecordListParams {
  page: number
  pageSize: number
  periodId?: number
  periodIds?: number[]
  legalEntityId?: number
  legalEntityIds?: number[]
  jurisdictionId?: number
  jurisdictionIds?: number[]
  taxTypeId?: number
  taxTypeIds?: number[]
  filingFrequencyId?: number
  filingMethodId?: number
  isReady?: boolean
  ordering?: string
}

export const useTvrRecords = (params: TvrRecordListParams) => {
  const apiParams: ApiTaxComplianceTvrRecordListParams = {
    page: params.page,
    page_size: params.pageSize,
    period: params.periodId,
    period__in: params.periodIds,
    legal_entity: params.legalEntityId,
    legal_entity__in: params.legalEntityIds,
    jurisdiction: params.jurisdictionId,
    jurisdiction__in: params.jurisdictionIds,
    tax_type: params.taxTypeId,
    tax_type__in: params.taxTypeIds,
    filing_frequency: params.filingFrequencyId,
    filing_method: params.filingMethodId,
    is_ready: params.isReady,
    ordering: params.ordering,
  }
  const { data, ...rest } = useApiTaxComplianceTvrRecordList(apiParams)

  return {
    data: data as unknown as PaginatedTVRRecordList,
    ...rest,
  }
}

export const useTvrRecordDetail = (id?: number) => {
  return useApiTaxComplianceTvrRecordRetrieve(id!, {
    query: { enabled: !!id },
  })
}

export const useTvrRecordCreate = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}

export const useTvrRecordUpdate = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordPartialUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}

export const useTvrRecordDelete = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordDestroy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}

export const useTvrRecordAddClientComments = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordAddClientCommentsCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}

export const useTvrRecordAddDstaxComments = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordAddDstaxCommentsCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}

export const useTvrRecordMarkPrepared = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrRecordMarkPreparedCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrRecordListQueryKey(),
        })
      },
    },
  })
}
