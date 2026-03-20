export interface FilingFrequencyParams {
  page: number
  pageSize: number
  search?: string
}

export interface FilingFrequency {
  id: string
  type: string
  description: string
  createdAt: string
}
