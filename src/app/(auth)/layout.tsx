'use client'

import MainHeader from '@/components/layouts/MainHeader'
import MainLayout from '@/components/layouts/MainLayout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout>
      <div className="flex h-screen flex-col">
        <MainHeader />
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </MainLayout>
  )
}
