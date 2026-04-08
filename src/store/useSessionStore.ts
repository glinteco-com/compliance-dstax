import { create } from 'zustand'
import type { Me } from '@/models/me'

interface SessionState {
  user: Me | null
  isAuthenticated: boolean
  isSessionLoading: boolean
  setUser: (user: Me | null) => void
  setSessionLoading: (loading: boolean) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  isSessionLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSessionLoading: (loading) => set({ isSessionLoading: loading }),
  clearSession: () =>
    set({ user: null, isAuthenticated: false, isSessionLoading: false }),
}))
