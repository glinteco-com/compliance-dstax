export interface FilingTypeParams {
  page: number
  pageSize: number
  search?: string
}

export interface FilingType {
  id: string
  type: string
  description: string
  createdAt: string
}
