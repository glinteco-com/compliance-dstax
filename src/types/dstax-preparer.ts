export interface PreparerParams {
  page: number
  pageSize: number
  search?: string
}

export interface Preparer {
  id: string
  name: string
  email: string
  assignedClients: number
}
