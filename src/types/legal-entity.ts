export interface LegalEntityParams {
  page: number
  pageSize: number
  search?: string
}

export interface LegalEntity {
  id: string
  clientName: string
  entityName: string
  entityType: string
  fein: string
  state: string
}
