'use client'

import {
  QueryClient as ClientQuery,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new ClientQuery({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
})

export default function QueryClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
