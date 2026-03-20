import apiClient from '@/api/api-client'
import { PaginatedResponse } from '@/types/api'
import {
  FilingFrequency,
  FilingFrequencyParams,
} from '@/types/filing-frequency'
import { FilingType, FilingTypeParams } from '@/types/filing-type'
import {
  JurisdictionLevel,
  JurisdictionLevelParams,
} from '@/types/jurisdiction-level'
import { Jurisdiction, JurisdictionParams } from '@/types/jurisdictions'
import {
  PrepaymentMethod,
  PrepaymentMethodParams,
} from '@/types/prepayment-method'
import { TaxType, TaxTypeParams } from '@/types/tax-type'

export const fetchFilingFrequencies = async (
  params: FilingFrequencyParams
): Promise<PaginatedResponse<FilingFrequency>> => {
  const { data } = await apiClient.get('/filing-frequencies', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchJurisdictions = async (
  params: JurisdictionParams
): Promise<PaginatedResponse<Jurisdiction>> => {
  const { data } = await apiClient.get('/jurisdictions', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchJurisdictionLevels = async (
  params: JurisdictionLevelParams
): Promise<PaginatedResponse<JurisdictionLevel>> => {
  const { data } = await apiClient.get('/jurisdiction-levels', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchFilingTypes = async (
  params: FilingTypeParams
): Promise<PaginatedResponse<FilingType>> => {
  const { data } = await apiClient.get('/filing-types', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchPrepaymentMethods = async (
  params: PrepaymentMethodParams
): Promise<PaginatedResponse<PrepaymentMethod>> => {
  const { data } = await apiClient.get('/prepayment-methods', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}

export const fetchTaxTypes = async (
  params: TaxTypeParams
): Promise<PaginatedResponse<TaxType>> => {
  const { data } = await apiClient.get('/tax-types', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
    },
  })
  return data
}
