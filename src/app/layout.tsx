import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import QueryClient from '@/components/provider/QueryClient'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DSTax - Compliance Management System',
  description: 'Advanced compliance and taxation management platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClient>
          <TooltipProvider>
            <Toaster richColors />
            <div vaul-drawer-wrapper="">{children}</div>
          </TooltipProvider>
        </QueryClient>
      </body>
    </html>
  )
}
