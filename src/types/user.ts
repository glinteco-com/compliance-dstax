export interface UserParams {
  page: number
  pageSize: number
  search?: string
}

export interface User {
  id: string
  clientName: string
  name: string
  username: string
  password?: string
  role: string
}
