import { Ticket } from '@/types/support-ticket'
import { useQueryClient, UseQueryResult } from '@tanstack/react-query'
import {
  useApiCoreSupportTicketList,
  useApiCoreSupportTicketCreate,
  useApiCoreSupportTicketUpdate,
  useApiCoreSupportTicketDestroy as useApiCoreSupportTicketDelete,
} from '@/api/generated/core-support-ticket/core-support-ticket'
import { PaginatedSupportTicketList, SupportTicket } from '@/models'

export interface TicketParams {
  page?: number
  pageSize?: number
  search?: string
  priority?: 'low' | 'normal' | 'high'
  created_by?: number
}

export const useSupportTickets = (params: TicketParams) => {
  return useApiCoreSupportTicketList({
    page: params.page,
    page_size: params.pageSize,
    title__icontains: params.search,
    created_by: params.created_by,
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  return useApiCoreSupportTicketCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/api/core/support_ticket/'],
        })
      },
    },
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  return useApiCoreSupportTicketUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/api/core/support_ticket/'],
        })
      },
    },
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  return useApiCoreSupportTicketDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/api/core/support_ticket/'],
        })
      },
    },
  })
}
