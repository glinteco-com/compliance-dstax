import {
  getCookie,
  setCookie,
  deleteCookie,
  hasCookie,
  OptionsType,
} from 'cookies-next'

/**
 * Utility for handling cookies across the application.
 * This wrapper around 'cookies-next' provides a consistent interface.
 *
 * For Server Components/Actions in App Router:
 * You may need to pass { cookies } from 'next/headers' in the options.
 *
 * Example:
 * const value = Cookies.get('my-cookie', { cookies });
 */

export const Cookies = {
  /**
   * Set a cookie
   */
  set: (key: string, value: any, options?: OptionsType) => {
    setCookie(key, value, {
      maxAge: 30 * 24 * 60 * 60, // Default 30 days
      path: '/',
      ...options,
    })
  },

  /**
   * Get a cookie
   */
  get: (key: string, options?: OptionsType) => {
    return getCookie(key, options)
  },

  /**
   * Remove a cookie
   */
  remove: (key: string, options?: OptionsType) => {
    deleteCookie(key, options)
  },

  /**
   * Check if a cookie exists
   */
  has: (key: string, options?: OptionsType) => {
    return hasCookie(key, options)
  },
}
