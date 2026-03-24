export interface Ticket {
  id: string
  name: string
  summary?: string
  createdDate: string
  priority: 'low' | 'normal' | 'high'
  description?: string
  dueDate?: string
  email?: string
}
