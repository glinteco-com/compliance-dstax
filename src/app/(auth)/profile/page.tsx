'use client'

import { useApiCoreUserMeRetrieve } from '@/api/generated/core-user/core-user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, Building2, Shield, Landmark } from 'lucide-react'
import Link from 'next/link'

const roleLabels: Record<string, string> = {
  DSTAX_ADMIN: 'DSTax Admin',
  DSTAX_PREPARER: 'DSTax Preparer',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_STAFF: 'Client Staff',
}

export default function ProfilePage() {
  const { data: me, isLoading, isError } = useApiCoreUserMeRetrieve()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !me) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        Failed to load profile.
      </div>
    )
  }

  const fullName =
    [me.first_name, me.last_name].filter(Boolean).join(' ') || '—'

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Name"
            value={fullName}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={me.email}
          />
          <InfoRow
            icon={<Shield className="h-4 w-4" />}
            label="Role"
            value={roleLabels[me.role] ?? me.role}
          />
        </CardContent>
      </Card>

      {me.managed_client && (
        <Card>
          <CardHeader>
            <CardTitle>Managed Client</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              icon={<Building2 className="h-4 w-4" />}
              label="Client"
              value={
                me.managed_client.id ? (
                  <Link
                    href={`/clients/${me.managed_client.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {me.managed_client.name}
                  </Link>
                ) : (
                  me.managed_client.name
                )
              }
            />
          </CardContent>
        </Card>
      )}

      {me.assigned_legal_entities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Legal Entities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {me.assigned_legal_entities.map((entity) => (
              <InfoRow
                key={entity.id}
                icon={<Landmark className="h-4 w-4" />}
                label={
                  entity.id ? (
                    <Link
                      href={`/legal-entities/${entity.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {entity.name}
                    </Link>
                  ) : (
                    entity.name
                  )
                }
                value={
                  entity.client?.id ? (
                    <Link
                      href={`/clients/${entity.client.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {entity.client.name}
                    </Link>
                  ) : (
                    (entity.client?.name ?? '—')
                  )
                }
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <div className="text-muted-foreground text-sm">
          Legal Entity: {label}
        </div>
        <div className="font-medium">Client: {value}</div>
      </div>
    </div>
  )
}
