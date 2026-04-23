'use client'

import { Fragment } from 'react'
import { Home, ChevronRight, Upload, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRole } from '@/lib/auth/role-utils'
import { cn } from '@/lib/utils'
import { useClientFoldersPage } from './hooks/useClientFoldersPage'
import { ClientFoldersToolbar } from './components/ClientFoldersToolbar'
import { ListViewTable } from './components/ListViewTable'
import { GridView } from './components/GridView'
import { FileDetailSidebar } from './components/FileDetailSidebar'

export default function ClientFoldersPage() {
  const { isDstaxRole } = useRole()
  const {
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
  } = useClientFoldersPage()

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col space-y-4 overflow-auto pr-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Client Folders
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              Manage and organize compliance documentation across global
              entities. Use the ledger below to access secure file storage.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Input
              placeholder="Search files..."
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>
        </div>

        {/* Tabs + action toolbar */}
        <ClientFoldersToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedIds.size}
          isDstaxRole={isDstaxRole}
          onCreateFolder={handleCreateFolder}
        />

        {/* Breadcrumb */}
        {currentPath.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-zinc-500">
            <button
              onClick={() => handleNavigateTo(-1)}
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <Home className="h-4 w-4" />
            </button>
            {currentPath.map((item, index) => (
              <Fragment key={item.id}>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <button
                  onClick={() => handleNavigateTo(index)}
                  className={cn(
                    'hover:text-zinc-900 dark:hover:text-zinc-100',
                    index === currentPath.length - 1 &&
                      'font-medium text-zinc-900 dark:text-zinc-100'
                  )}
                >
                  {item.name}
                </button>
              </Fragment>
            ))}
          </nav>
        )}

        {/* Content — full-area drop zone */}
        <div
          className="relative"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          {viewMode === 'list' ? (
            <ListViewTable
              items={currentItems}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleAll={handleToggleAll}
              isDstaxRole={isDstaxRole}
              onDetails={handleOpenDetails}
              onOpenFolder={handleOpenFolder}
            />
          ) : (
            <GridView
              items={currentItems}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              isDstaxRole={isDstaxRole}
              onDetails={handleOpenDetails}
              onOpenFolder={handleOpenFolder}
            />
          )}

          {isDragOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-orange-400 bg-orange-50/80 backdrop-blur-sm dark:bg-orange-950/50">
              <Upload className="h-10 w-10 text-orange-500" />
              <p className="text-sm font-semibold text-orange-600">
                Drop files to upload
              </p>
            </div>
          )}
        </div>
      </div>

      <FileDetailSidebar item={detailItem} onClose={handleCloseDetails} />
    </div>
  )
}
