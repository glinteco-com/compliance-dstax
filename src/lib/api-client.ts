import { Cookies } from '@/lib/cookies'
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

/**
 * Axios instance configured for API calls.
 * Base URL is pulled from environment variables or defaults to /api.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout
})

// Request interceptor for adding auth tokens or other headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get the session token from cookies
    // better-auth uses 'better-auth.session_token' by default
    const token =
      Cookies.get('better-auth.session_token') || Cookies.get('token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle specific status codes
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        // Unauthorized: clear auth state or redirect to login
        console.warn('Unauthorized access - redirecting to login')
      } else if (status === 403) {
        console.error('Permission denied')
      } else if (status >= 500) {
        console.error('Server error occurred')
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received')
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
