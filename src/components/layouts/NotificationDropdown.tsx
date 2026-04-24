'use client'

import { useEffect, useRef } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NoData } from '@/components/no-data/NoData'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/mock-data/notifications'

const typeAccentClass: Record<Notification['type'], string> = {
  info: 'border-l-blue-500',
  success: 'border-l-green-500',
  warning: 'border-l-yellow-500',
  error: 'border-l-red-500',
}

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 border-l-3 border-gray-200 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="mt-1 h-2 w-2 shrink-0 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-3/4 rounded" />
      <Skeleton className="mt-0.5 h-2.5 w-20 rounded" />
    </div>
  )
}

export function NotificationDropdown() {
  const {
    notifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications()

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    toast.success('All notifications marked as read.')
  }

  const handleClearAll = () => {
    clearAll()
    toast.success('All notifications cleared.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-400 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
        </div>
        <DropdownMenuSeparator className="my-0" />
        <div className="max-h-100 overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <NotificationSkeleton key={index} />
            ))
          ) : notifications.length === 0 ? (
            <NoData message="No notifications" className="py-8" />
          ) : (
            <>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-0.5 border-l-3 border-gray-200 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                    // typeAccentClass[notification.type],
                    !notification.isRead &&
                      'border-orange-400 bg-neutral-50 dark:bg-neutral-800/30'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'text-sm leading-tight font-medium',
                        notification.isRead &&
                          'text-muted-foreground font-normal'
                      )}
                    >
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="bg-brand-orange mt-1 h-2 w-2 shrink-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-muted-foreground mt-0.5 text-[11px]">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </button>
              ))}
              {isFetchingMore && (
                <>
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </>
              )}
              {hasMore && !isFetchingMore && (
                <div ref={sentinelRef} className="h-1" />
              )}
            </>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <div className="flex items-center justify-between px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
            onClick={handleClearAll}
            disabled={notifications.length === 0 && !isLoading}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
