export interface TaxTypeParams {
  page: number
  pageSize: number
  search?: string
}

export interface TaxType {
  id: string
  type: string
  description: string
}
