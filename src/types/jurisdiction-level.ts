export interface JurisdictionLevelParams {
  page: number
  pageSize: number
  search?: string
}

export interface JurisdictionLevel {
  id: string
  name: string
  description?: string
}
