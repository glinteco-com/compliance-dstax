import apiClient from '@/api/api-client'
import type { AxiosError, AxiosRequestConfig } from 'axios'

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = apiClient(config).then(({ data }) => data)
  return promise
}

export default customInstance

export type ErrorType<Error> = AxiosError<Error>
