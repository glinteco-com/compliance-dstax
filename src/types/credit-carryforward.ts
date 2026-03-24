export interface CreditCarryforward {
  id: string
  client: string
  legalEntity: string
  jurisdiction: string
  priorBalance: number
  currentPeriod: number
  endingBalance: number
}

export interface CreditCarryforwardParams {
  page: number
  pageSize: number
  search?: string
  client?: string
  legalEntity?: string
  jurisdiction?: string
}
