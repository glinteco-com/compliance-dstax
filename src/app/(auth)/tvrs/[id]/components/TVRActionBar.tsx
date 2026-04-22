'use client'

import { BackButton } from '@/components/button/BackButton'
import { Button } from '@/components/ui/button'
import { PanelRight } from 'lucide-react'

interface TVRActionBarProps {
  userRole: string | undefined
  clientName: string | undefined
  changedRowIds: Set<string>
  allRecordsReady: boolean
  isPublished: boolean
  isPreparing: boolean
  isPublishing: boolean
  isCommenting: boolean
  isFundingReceiving: boolean
  onPrepare: () => void
  onPublish: () => void
  onComment: () => void
  onFundingReceived: () => void
  onTogglePanel: () => void
}

export function TVRActionBar({
  userRole,
  clientName,
  changedRowIds,
  allRecordsReady,
  isPublished,
  isPreparing,
  isPublishing,
  isCommenting,
  isFundingReceiving,
  onPrepare,
  onPublish,
  onComment,
  onFundingReceived,
  onTogglePanel,
}: TVRActionBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-bold tracking-tight">
          TVR — {clientName ?? 'Loading...'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {userRole === 'DSTAX_PREPARER' && (
          <Button
            variant="default"
            onClick={onPrepare}
            disabled={isPreparing || changedRowIds.size === 0}
          >
            {isPreparing ? 'Preparing...' : 'PREPARED'}
            {changedRowIds.size > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                {changedRowIds.size}
              </span>
            )}
          </Button>
        )}
        {userRole === 'DSTAX_ADMIN' && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onTogglePanel}
              title="Toggle supplemental info"
            >
              <PanelRight className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              onClick={onPublish}
              disabled={isPublishing || !allRecordsReady}
            >
              {isPublishing ? 'Publishing...' : 'PUBLISH'}
            </Button>
          </>
        )}
        {(userRole === 'DSTAX_ADMIN' || userRole === 'CLIENT_ADMIN') && (
          <Button
            variant="default"
            onClick={onComment}
            disabled={isCommenting || changedRowIds.size === 0}
          >
            {isCommenting ? 'Saving...' : 'SAVE COMMENTS'}
            {changedRowIds.size > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                {changedRowIds.size}
              </span>
            )}
          </Button>
        )}
        {userRole === 'DSTAX_ADMIN' && (
          <Button
            variant="outline"
            onClick={onFundingReceived}
            disabled={isFundingReceiving || !isPublished}
          >
            {isFundingReceiving ? 'Processing...' : 'FUNDING RECEIVED'}
          </Button>
        )}
      </div>
    </div>
  )
}
