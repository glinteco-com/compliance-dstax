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
      <div className="flex h-screen flex-col overflow-hidden">
        <MainHeader />
        <div className="text-foreground flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </MainLayout>
  )
}
