'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/auth/role-utils'

export default function HomePage() {
  const { isDstaxRole, isClientRole, isSessionLoading } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (isSessionLoading) return

    if (isDstaxRole) {
      router.replace('/clients')
    } else if (isClientRole) {
      router.replace('/client')
    }
  }, [isDstaxRole, isClientRole, isSessionLoading, router])

  return null
}
