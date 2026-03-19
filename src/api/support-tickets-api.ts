import apiClient from '@/api/api-client'
import { PaginatedResponse } from '@/types/api'
import { Ticket } from '@/types/support-ticket'

export interface TicketParams {
  page?: number
  pageSize?: number
  search?: string
  priority?: 'low' | 'normal' | 'high'
}

export const fetchTickets = async (
  params: TicketParams
): Promise<PaginatedResponse<Ticket>> => {
  const { data } = await apiClient.get('/support-tickets', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
      priority: params.priority,
    },
  })
  return data
}

export const createTicket = async (
  ticket: Partial<Ticket>
): Promise<Ticket> => {
  const { data } = await apiClient.post('/support-tickets', ticket)
  return data
}

export const updateTicket = async (
  ticket: Partial<Ticket>
): Promise<Ticket> => {
  const { data } = await apiClient.put(
    `/support-tickets?id=${ticket.id}`,
    ticket
  )
  return data
}

export const deleteTicket = async (id: string): Promise<void> => {
  await apiClient.delete(`/support-tickets?id=${id}`)
}
