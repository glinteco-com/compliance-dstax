export type JurisdictionLevel = 'Country' | 'State' | 'Local'

export interface Jurisdiction {
  id: string
  name: string
  level: JurisdictionLevel
  dueDate: string
  dueDateTime: string
}
