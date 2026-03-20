export type JurisdictionLevel = 'Country' | 'State' | 'Local'

export interface JurisdictionParams {
  page: number
  pageSize: number
  search?: string
}

export interface Jurisdiction {
  id: string
  name: string
  level: JurisdictionLevel
  dueDate: string
  dueDateTime: string
}
