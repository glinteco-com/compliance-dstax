import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  TicketParams,
} from '@/api/support-tickets-api'
import { Ticket } from '@/types/support-ticket'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useSupportTickets = (params: TicketParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['support-tickets', params],
    queryFn: () => fetchTickets(params),
  })

  return { data, ...rest }
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newTicket: Partial<Ticket>) => createTicket(newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedTicket: Partial<Ticket>) => updateTicket(updatedTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}
