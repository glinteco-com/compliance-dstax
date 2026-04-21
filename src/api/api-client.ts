import { Cookies, getAuthToken } from '@/lib/cookies'
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { getCookie } from 'cookies-next'

/**
 * Axios instance configured for API calls.
 * Base URL is pulled from environment variables or defaults to /api.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}` || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value)) {
          if (key.endsWith('__in')) {
            searchParams.append(key, value.join(','))
          } else {
            value.forEach((v) => searchParams.append(key, String(v)))
          }
        } else {
          searchParams.append(key, String(value))
        }
      })
      return searchParams.toString()
    },
  },
})

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// Request interceptor for adding auth tokens or other headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      getAuthToken() || (getCookie('better-auth.session_token') as string)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor with automatic token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/token/refresh/'
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = Cookies.get('refreshToken') as string

      if (!refreshToken) {
        isRefreshing = false
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        )

        const newAccessToken = data.access
        Cookies.set('token', newAccessToken)

        if (data.refresh) {
          Cookies.set('refreshToken', data.refresh)
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response) {
      const { status } = error.response
      if (status === 403) {
        console.error('Permission denied')
      } else if (status >= 500) {
        console.error('Server error occurred')
      }
    } else if (error.request) {
      console.error('Network error - no response received')
    } else {
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
