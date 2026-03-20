export interface PrepaymentMethodParams {
  page: number
  pageSize: number
  search?: string
}

export interface PrepaymentMethod {
  id: string
  state: string
  method: string
}
