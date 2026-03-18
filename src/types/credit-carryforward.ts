export interface CreditCarryforward {
  id: string
  client: string
  legalEntity: string
  jurisdiction: string
  priorBalance: number
  currentPeriod: number
  endingBalance: number
}
