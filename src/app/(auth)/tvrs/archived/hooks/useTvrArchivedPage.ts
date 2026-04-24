import { useState } from 'react'
import { useTvrPeriods } from '../../hooks/useTvrPeriods'
import type { ApiTaxComplianceTvrPeriodListWorkflowStatus } from '@/models/apiTaxComplianceTvrPeriodListWorkflowStatus'

export function useTvrArchivedPage() {
  const [clientId, setClientIdState] = useState<number | undefined>()
  const [periodMonth, setPeriodMonthState] = useState<number | undefined>()
  const [periodYear, setPeriodYearState] = useState<number | undefined>()
  const [workflowStatus, setWorkflowStatusState] = useState<
    ApiTaxComplianceTvrPeriodListWorkflowStatus | undefined
  >()
  const [createdAtGte, setCreatedAtGteState] = useState<string | undefined>()
  const [createdAtLte, setCreatedAtLteState] = useState<string | undefined>()
  const [ordering, setOrderingState] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const setClientId = (value: number | undefined) => {
    setClientIdState(value)
    setCurrentPage(1)
  }
  const setPeriodMonth = (value: number | undefined) => {
    setPeriodMonthState(value)
    setCurrentPage(1)
  }
  const setPeriodYear = (value: number | undefined) => {
    setPeriodYearState(value)
    setCurrentPage(1)
  }
  const setWorkflowStatus = (
    value: ApiTaxComplianceTvrPeriodListWorkflowStatus | undefined
  ) => {
    setWorkflowStatusState(value)
    setCurrentPage(1)
  }
  const setCreatedAtGte = (value: string | undefined) => {
    setCreatedAtGteState(value)
    setCurrentPage(1)
  }
  const setCreatedAtLte = (value: string | undefined) => {
    setCreatedAtLteState(value)
    setCurrentPage(1)
  }
  const setOrdering = (value: string | undefined) => {
    setOrderingState(value)
    setCurrentPage(1)
  }

  const { data, isLoading } = useTvrPeriods({
    page: currentPage,
    pageSize,
    clientId,
    periodMonth,
    periodYear,
    workflowStatus,
    createdAtGte,
    createdAtLte,
    ordering,
  })

  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setClientIdState(undefined)
    setPeriodMonthState(undefined)
    setPeriodYearState(undefined)
    setWorkflowStatusState(undefined)
    setCreatedAtGteState(undefined)
    setCreatedAtLteState(undefined)
    setOrderingState(undefined)
    setCurrentPage(1)
  }

  const hasActiveFilters = !!(
    clientId ||
    periodMonth ||
    periodYear ||
    workflowStatus ||
    createdAtGte ||
    createdAtLte ||
    ordering
  )

  return {
    clientId,
    setClientId,
    periodMonth,
    setPeriodMonth,
    periodYear,
    setPeriodYear,
    workflowStatus,
    setWorkflowStatus,
    createdAtGte,
    setCreatedAtGte,
    createdAtLte,
    setCreatedAtLte,
    ordering,
    setOrdering,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
    data,
    isLoading,
    totalPages,
    clearFilters,
    hasActiveFilters,
  }
}
