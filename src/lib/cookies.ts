import { CONFIG_COOKIE } from '@/constants/cookies'
import { deleteCookie, getCookie, OptionsType, setCookie } from 'cookies-next'

const PREFIX = process.env.NEXT_PUBLIC_PREFIX || ''

export const setCrossCookie = (
  key: string,
  data: any,
  options?: OptionsType
) => {
  setCookie(PREFIX + key, data, {
    ...CONFIG_COOKIE,
    ...options,
  } as OptionsType)
}

export const deleteCrossCookie = (key: string, options?: OptionsType) => {
  deleteCookie(PREFIX + key, {
    ...CONFIG_COOKIE,
    ...options,
  } as OptionsType)
}

export const getCrossCookie = (key: string, options?: OptionsType) => {
  return getCookie(PREFIX + key, {
    ...CONFIG_COOKIE,
    ...options,
  } as OptionsType)
}

export const Cookies = {
  get: getCrossCookie,
  set: setCrossCookie,
  remove: deleteCrossCookie,
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return (getCrossCookie('token') as string) ?? ''
  }
  return ''
}
