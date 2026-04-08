import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/api-client'
import { Cookies, getAuthToken } from '@/lib/cookies'
import { useSessionStore } from '@/store/useSessionStore'

import { authClient } from '@/lib/auth/auth-client'
import {
  useApiCoreAuthLoginCreate,
  apiCoreAuthLogoutCreate,
} from '@/api/generated/auth/auth'
import { useApiTokenRefreshCreate } from '@/api/generated/api/api'

/**
 * Hook for authentication-related operations using React Query and Axios.
 */
export const useAuth = () => {
  const queryClient = useQueryClient()

  /**
   * Mutation for signing in
   */
  const signInMutation = useApiCoreAuthLoginCreate({
    mutation: {
      onSuccess: (data) => {
        if (data.access) {
          Cookies.set('token', data.access)
        }
        if (data.refresh) {
          Cookies.set('refreshToken', data.refresh)
        }
        queryClient.invalidateQueries({ queryKey: ['session'] })
      },
    },
  })

  /**
   * Mutation for signing out
   */
  const signOutMutation = useMutation({
    mutationFn: async () => {
      // 1. Clear better-auth session
      await authClient.signOut()

      // 2. Clear custom HttpOnly cookies via API
      const refresh = ((await Cookies.get('refreshToken')) as string) || ''
      try {
        await apiCoreAuthLogoutCreate({ refresh })
      } catch (err) {
        console.error('Logout API failed:', err)
      }

      // 3. Clear any remaining client-side cookies
      Cookies.remove('token')
      Cookies.remove('refreshToken')
    },
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(['session'], null)
    },
  })

  /**
   * Query for fetching current session
   */
  const { setUser, setSessionLoading, clearSession } = useSessionStore()

  const hasToken = !!getAuthToken()

  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/api/core/user/me')
        return data
      } catch (error) {
        return null
      }
    },
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!hasToken) {
      setSessionLoading(false)
      return
    }
    if (sessionQuery.data) {
      setUser(sessionQuery.data)
      setSessionLoading(false)
    } else if (!sessionQuery.isLoading) {
      clearSession()
    }
  }, [
    sessionQuery.data,
    sessionQuery.isLoading,
    hasToken,
    setUser,
    setSessionLoading,
    clearSession,
  ])

  /**
   * Mutation for exchanging/refreshing tokens
   */
  const exchangeTokenMutation = useApiTokenRefreshCreate({
    mutation: {
      onSuccess: (data) => {
        if (data.access) {
          Cookies.set('token', data.access)
        }
        if (data.refresh) {
          Cookies.set('refreshToken', data.refresh)
        }
        queryClient.invalidateQueries({ queryKey: ['session'] })
      },
    },
  })

  return {
    signInMutation,
    signOutMutation,
    sessionQuery,
    exchangeTokenMutation,
    user: sessionQuery.data,
    isAuthenticated: !!sessionQuery.data,
    isLoading: sessionQuery.isLoading,
  }
}

export default useAuth
