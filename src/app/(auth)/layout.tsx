import MainLayout from '@/components/layouts/MainLayout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
