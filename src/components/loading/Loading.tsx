'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  className?: string
  size?: number
  text?: string
  fullScreen?: boolean
}

export function Loading({
  className,
  size = 24,
  text,
  fullScreen = false,
}: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        fullScreen && 'fixed inset-0 z-50 bg-white/80 dark:bg-zinc-950/80',
        !fullScreen && 'h-full min-h-[120px] w-full',
        className
      )}
    >
      <Loader2
        className="animate-spin text-zinc-500 dark:text-zinc-400"
        style={{ width: size, height: size }}
      />
      {text && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{text}</p>
      )}
    </div>
  )
}
