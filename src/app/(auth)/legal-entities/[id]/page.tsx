'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useApiCoreLegalEntityRetrieve } from '@/api/generated/core-legal-entity/core-legal-entity'
import { useApiCoreClientRetrieve } from '@/api/generated/core-client/core-client'
import { useApiTaxComplianceTvrPeriodActivesList } from '@/api/generated/tax-compliance-tvr-period/tax-compliance-tvr-period'
import { RoleEnum } from '@/models/roleEnum'
import { useRole } from '@/lib/auth/role-utils'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/button/BackButton'
import { UserSection } from './components/UserSection'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function LegalEntityDetailPage({ params }: PageProps) {
  const { isDstaxAdmin, isDstaxPreparer, isSessionLoading } = useRole()
  const { id } = use(params)
  const entityId = Number(id)

  const { data: entity, isLoading } = useApiCoreLegalEntityRetrieve(entityId, {
    query: { enabled: !!entityId },
  })

  const e = entity as unknown as
    | {
        id: number
        name: string
        client: number | { id: number; name: string }
        is_active?: boolean
      }
    | undefined

  const clientId = e
    ? typeof e.client === 'object'
      ? e.client.id
      : e.client
    : 0

  const { data: clientData } = useApiCoreClientRetrieve(clientId, {
    query: { enabled: !!clientId },
  })

  const { data: tvrPeriodData } = useApiTaxComplianceTvrPeriodActivesList(
    { client: clientId },
    { query: { enabled: !!clientId } }
  )
  const activeTvrId = (
    tvrPeriodData?.results?.[0] as { id?: number } | undefined
  )?.id

  if (isSessionLoading) {
    return null
  }

  if (!isDstaxAdmin && !isDstaxPreparer) {
    redirect('/')
  }

  if (isLoading) {
    return (
      <div className="min-w-0 flex-1 space-y-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      </div>
    )
  }

  if (!e) {
    return (
      <div className="flex min-h-50 items-center justify-center text-zinc-500">
        Legal entity not found.
      </div>
    )
  }

  const clientName = clientData?.name ?? '—'

  return (
    <div className="min-w-0 flex-1 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BackButton />

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {e.name}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Legal entity details
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Basic Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Name
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {e.name}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Client
            </span>
            <Link
              href={`/clients/${clientId}`}
              className="font-semibold text-orange-500 hover:underline"
            >
              {clientName}
            </Link>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Status
            </span>
            <span
              className={
                e.is_active !== false
                  ? 'font-semibold text-green-600 dark:text-green-400'
                  : 'font-semibold text-zinc-400'
              }
            >
              {e.is_active !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Current TVR
            </span>
            <Link
              href={
                activeTvrId
                  ? `/tvrs/${activeTvrId}?legalEntityId=${e.id}`
                  : `/tvrs?clientId=${clientId}&legalEntityId=${e.id}`
              }
            >
              <Button
                variant="outline"
                size="sm"
                className="w-fit gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                View TVR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <UserSection
        title="Client Staff"
        entityId={e.id}
        role={RoleEnum.CLIENT_STAFF}
      />
      <UserSection
        title="DSTax Preparers"
        entityId={e.id}
        role={RoleEnum.DSTAX_PREPARER}
      />
    </div>
  )
}
