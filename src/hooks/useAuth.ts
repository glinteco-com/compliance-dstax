import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { Cookies } from '@/lib/cookies'

/**
 * Hook for authentication-related operations using React Query and Axios.
 */
export const useAuth = () => {
  const queryClient = useQueryClient()

  /**
   * Mutation for signing in
   */
  const signInMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await apiClient.post('/login', credentials)
      return data
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set('token', data.token)
      }
      if (data.refreshToken) {
        Cookies.set('refreshToken', data.refreshToken)
      }
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  /**
   * Mutation for signing out
   */
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/auth/sign-out')
      return data
    },
    onSuccess: () => {
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      Cookies.remove('better-auth.session_token')
      queryClient.clear()
      queryClient.setQueryData(['session'], null)
    },
  })

  /**
   * Query for fetching current session
   */
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/me')
        return data
      } catch (error) {
        return null
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  /**
   * Mutation for exchanging/refreshing tokens
   */
  const exchangeTokenMutation = useMutation({
    mutationFn: async (refreshToken: string) => {
      const { data } = await apiClient.post('/auth/token/exchange', {
        refreshToken,
      })
      return data
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set('token', data.token)
      }
      if (data.refreshToken) {
        Cookies.set('refreshToken', data.refreshToken)
      }
      queryClient.invalidateQueries({ queryKey: ['session'] })
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
