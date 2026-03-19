'use client'

import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface NoDataProps {
  className?: string
  message?: string
  icon?: React.ReactNode
}

export function NoData({
  className,
  message = 'No data found',
  icon,
}: NoDataProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-10 text-zinc-400 dark:text-zinc-500',
        className
      )}
    >
      {icon ?? <Inbox className="h-10 w-10" />}
      <p className="text-sm">{message}</p>
    </div>
  )
}
