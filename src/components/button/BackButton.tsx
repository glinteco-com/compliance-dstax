'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick?: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick || (() => router.back())}
      className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  )
}
