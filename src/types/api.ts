export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  page_size: number
  results: T[]
}
