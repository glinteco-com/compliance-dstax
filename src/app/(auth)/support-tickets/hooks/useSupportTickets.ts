import { Ticket } from '@/types/support-ticket'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface TicketParams {
  page?: number
  pageSize?: number
  search?: string
  priority?: 'low' | 'normal' | 'high'
}

let mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    name: 'Login Issue',
    summary: 'User cannot login to port',
    createdDate: '2026-03-24',
    priority: 'high',
    description: 'System throws 500 error when clicking on login',
    email: 'user@example.com',
  },
  {
    id: 'TKT-002',
    name: 'Form validation error',
    summary: 'Tax form throws validation missing',
    createdDate: '2026-03-23',
    priority: 'normal',
    description: 'The fields are filled but it says empty',
    email: 'test@mail.com',
  },
]

export const useSupportTickets = (params: TicketParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['support-tickets', params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filtered = [...mockTickets]
      if (params.search) {
        const query = params.search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.summary?.toLowerCase().includes(query)
        )
      }
      if (params.priority) {
        filtered = filtered.filter((t) => t.priority === params.priority)
      }

      const pageSize = params.pageSize || 10
      const page = params.page || 1
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginated = filtered.slice(start, end)

      return {
        results: paginated,
        count: filtered.length,
      }
    },
  })

  return { data, ...rest }
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newTicket: Partial<Ticket>) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const ticket: Ticket = {
        ...newTicket,
        id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0],
      } as Ticket
      mockTickets = [ticket, ...mockTickets]
      return ticket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedTicket: Partial<Ticket>) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      mockTickets = mockTickets.map((t) =>
        t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t
      )
      return updatedTicket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      mockTickets = mockTickets.filter((t) => t.id !== id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
    },
  })
}
