'use client'

import { use } from 'react'
import { BackButton } from '@/components/button/BackButton'
import { ClientDetailView } from '../components/ClientDetailView'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'
import { useClientDetail } from './hooks/useClientDetail'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{ clientId: string }>
}

export default function ClientDetailPage({ params }: PageProps) {
  const { isDstaxAdmin, isDstaxPreparer, isSessionLoading } = useRole()
  const { clientId } = use(params)
  const id = Number(clientId)
  const { clientData, isLoading } = useClientDetail(id)

  if (isSessionLoading) {
    return null
  }

  if (!isDstaxAdmin && !isDstaxPreparer) {
    redirect('/')
  }

  if (isLoading) {
    return (
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-1 h-4 w-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        Client not found.
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center gap-3">
        <BackButton />

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {clientData.name}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Client details, legal entities, and TVR periods.
          </p>
        </div>
      </div>

      <ClientDetailView
        clientId={clientData.id}
        clientName={clientData.name}
        showUsers={isDstaxAdmin}
      />
    </div>
  )
}
