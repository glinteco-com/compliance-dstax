'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import type { FSItem, TabValue, ViewMode } from '../types'
import { TAB_DATA } from '../mock-data'

export function useClientFoldersPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('client-documents')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailItem, setDetailItem] = useState<FSItem | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [currentPath, setCurrentPath] = useState<FSItem[]>([])
  const [extraItems, setExtraItems] = useState<FSItem[]>([])
  const [searchInput, setSearchInput] = useState('')
  const dragCounter = useRef(0)

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab)
    setSelectedIds(new Set())
    setCurrentPath([])
    setExtraItems([])
    setSearchInput('')
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
  }, [])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const currentItems = useMemo(() => {
    const base =
      currentPath.length === 0 ? [...extraItems, ...TAB_DATA[activeTab]] : []
    if (!searchInput.trim()) return base
    const query = searchInput.toLowerCase()
    return base.filter((item) => item.name.toLowerCase().includes(query))
  }, [activeTab, currentPath, extraItems, searchInput])

  const handleToggleAll = useCallback(() => {
    setSelectedIds((previous) => {
      if (previous.size === currentItems.length) return new Set()
      return new Set(currentItems.map((item) => item.id))
    })
  }, [currentItems])

  const handleOpenDetails = useCallback((item: FSItem) => {
    setDetailItem(item)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setDetailItem(null)
  }, [])

  const handleOpenFolder = useCallback((item: FSItem) => {
    setCurrentPath((previous) => [...previous, item])
    setSelectedIds(new Set())
  }, [])

  const handleNavigateTo = useCallback((index: number) => {
    setCurrentPath((previous) => previous.slice(0, index + 1))
    setSelectedIds(new Set())
  }, [])

  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: FSItem = {
      id: `local-${Date.now()}`,
      name,
      type: 'folder',
      dateModified: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'You',
      modifiedBy: 'You',
    }
    setExtraItems((previous) => [newFolder, ...previous])
    toast.success(`Folder "${name}" created`)
  }, [])

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    dragCounter.current += 1
    if (dragCounter.current === 1) setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    dragCounter.current -= 1
    if (dragCounter.current === 0) setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    dragCounter.current = 0
    setIsDragOver(false)
  }, [])

  return {
    activeTab,
    handleTabChange,
    viewMode,
    setViewMode,
    selectedIds,
    handleToggleSelect,
    handleToggleAll,
    detailItem,
    handleOpenDetails,
    handleCloseDetails,
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    currentPath,
    currentItems,
    handleOpenFolder,
    handleNavigateTo,
    handleCreateFolder,
    searchInput,
    handleSearchChange,
  }
}
