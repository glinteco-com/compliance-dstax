import { create } from 'zustand'
import type { Me } from '@/models/me'

interface SessionState {
  user: Me | null
  isAuthenticated: boolean
  setUser: (user: Me | null) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}))
