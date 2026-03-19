export interface Ticket {
  id: string
  createdDate: string
  name: string
  priority: 'low' | 'normal' | 'high'
  email: string
  summary?: string
  description?: string
  dueDate?: string
}

export interface ApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  page_size: number
  results: T[]
}
