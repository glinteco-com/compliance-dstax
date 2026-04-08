'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ClientDetailView } from '../components/ClientDetailView'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'
import { useClientDetail } from './hooks/useClientDetail'

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
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        Loading...
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
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Link href="/clients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
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
