'use client'

import { redirect } from 'next/navigation'
import { useRole } from '@/lib/auth/role-utils'
import { ClientDetailView } from '../clients/components/ClientDetailView'

export default function ClientPage() {
  const { user, isClientAdmin, isClientStaff, isSessionLoading } = useRole()

  if (isSessionLoading) {
    return null
  }

  if (!isClientAdmin && !isClientStaff) {
    redirect('/')
  }

  if (!user?.managed_client) {
    return (
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        No client assigned to your account.
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {user.managed_client.name}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Your client overview — legal entities and TVR periods.
        </p>
      </div>

      <ClientDetailView
        clientId={user.managed_client.id}
        clientName={user.managed_client.name}
        showUsers={isClientAdmin}
      />
    </div>
  )
}
