import { useState, useCallback, useEffect, useRef } from 'react'
import {
  mockNotifications,
  type Notification,
} from '@/lib/mock-data/notifications'

const PAGE_SIZE = 5

function simulateFetch(
  page: number
): Promise<{ items: Notification[]; hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE
      const items = mockNotifications.slice(start, start + PAGE_SIZE)
      resolve({ items, hasMore: start + PAGE_SIZE < mockNotifications.length })
    }, 600)
  })
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    simulateFetch(1).then(({ items, hasMore: more }) => {
      if (!isMountedRef.current) return
      setNotifications(items)
      setHasMore(more)
      setIsLoading(false)
    })
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore) return
    setIsFetchingMore(true)
    const nextPage = pageRef.current + 1
    simulateFetch(nextPage).then(({ items, hasMore: more }) => {
      if (!isMountedRef.current) return
      pageRef.current = nextPage
      setNotifications((previous) => [...previous, ...items])
      setHasMore(more)
      setIsFetchingMore(false)
    })
  }, [isFetchingMore, hasMore])

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length

  const markAsRead = (id: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({ ...notification, isRead: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
    setHasMore(false)
  }

  return {
    notifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  }
}
