import { create } from 'zustand'
import type { TVRPeriod } from '@/models/tVRPeriod'

interface TvrPeriodState {
  selectedPeriod: TVRPeriod | null
  setSelectedPeriod: (period: TVRPeriod | null) => void
}

export const useTvrPeriodStore = create<TvrPeriodState>((set) => ({
  selectedPeriod: null,
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
}))
