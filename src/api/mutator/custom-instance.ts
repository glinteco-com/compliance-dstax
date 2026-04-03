import apiClient from '@/api/api-client'
import type { AxiosError, AxiosRequestConfig } from 'axios'

export interface ApiErrorItem {
  code: string
  detail: string
  attr: string | null
}

export interface ApiErrorResponse {
  type: string
  errors: ApiErrorItem[]
}

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = apiClient(config).then(({ data }) => data)
  return promise
}

export default customInstance

export type ErrorType<Error = ApiErrorResponse> = AxiosError<Error>

export function getApiErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  const axiosError = error as ErrorType
  const data = axiosError.response?.data
  if (data?.errors?.length) {
    return data.errors.map((e) => e.detail).join(', ')
  }
  if (axiosError.message) return axiosError.message
  return fallback
}
