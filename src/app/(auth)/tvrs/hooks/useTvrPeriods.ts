import { useQueryClient } from '@tanstack/react-query'
import {
  getApiTaxComplianceTvrPeriodListQueryKey,
  useApiTaxComplianceTvrPeriodList,
  useApiTaxComplianceTvrPeriodRetrieve,
  useApiTaxComplianceTvrPeriodCreate,
  useApiTaxComplianceTvrPeriodPartialUpdate,
  useApiTaxComplianceTvrPeriodDestroy,
  useApiTaxComplianceTvrPeriodPublishCreate,
  useApiTaxComplianceTvrPeriodFundingReceivedCreate,
  useApiTaxComplianceTvrPeriodActivesList,
} from '@/api/generated/tax-compliance-tvr-period/tax-compliance-tvr-period'
import { ApiTaxComplianceTvrPeriodListParams } from '@/models/apiTaxComplianceTvrPeriodListParams'
import { ApiTaxComplianceTvrPeriodListWorkflowStatus } from '@/models/apiTaxComplianceTvrPeriodListWorkflowStatus'
import { PaginatedTVRPeriodList } from '@/models/paginatedTVRPeriodList'
import { TVRPeriod } from '@/models/tVRPeriod'

interface TvrPeriodListParams {
  page: number
  pageSize: number
  clientId?: number
  clientIds?: number[]
  periodMonth?: number
  periodYear?: number
  workflowStatus?: ApiTaxComplianceTvrPeriodListWorkflowStatus
  workflowStatusIn?: string[]
  ordering?: string
  createdAtGte?: string
  createdAtLte?: string
}

export const useTvrPeriods = (params: TvrPeriodListParams) => {
  const apiParams: ApiTaxComplianceTvrPeriodListParams = {
    page: params.page,
    page_size: params.pageSize,
    client: params.clientId,
    client__in: params.clientIds,
    period_month: params.periodMonth,
    period_year: params.periodYear,
    workflow_status: params.workflowStatus,
    workflow_status__in: params.workflowStatusIn,
    ordering: params.ordering,
    created_at__gte: params.createdAtGte,
    created_at__lte: params.createdAtLte,
  }
  const { data, ...rest } = useApiTaxComplianceTvrPeriodList(apiParams)

  return {
    data: data as unknown as PaginatedTVRPeriodList,
    ...rest,
  }
}

export const useTvrPeriodDetail = (id?: number) => {
  return useApiTaxComplianceTvrPeriodRetrieve(id!, {
    query: { enabled: !!id },
  })
}

export const useTvrPeriodActives = () => {
  const { data, ...rest } = useApiTaxComplianceTvrPeriodActivesList()
  return {
    data: (data?.results as unknown as TVRPeriod[]) ?? [],
    ...rest,
  }
}

export const useTvrPeriodCreate = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrPeriodCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrPeriodListQueryKey(),
        })
      },
    },
  })
}

export const useTvrPeriodUpdate = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrPeriodPartialUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrPeriodListQueryKey(),
        })
      },
    },
  })
}

export const useTvrPeriodDelete = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrPeriodDestroy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrPeriodListQueryKey(),
        })
      },
    },
  })
}

export const useTvrPeriodPublish = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrPeriodPublishCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrPeriodListQueryKey(),
        })
      },
    },
  })
}

export const useTvrPeriodFundingReceived = () => {
  const queryClient = useQueryClient()

  return useApiTaxComplianceTvrPeriodFundingReceivedCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiTaxComplianceTvrPeriodListQueryKey(),
        })
      },
    },
  })
}
