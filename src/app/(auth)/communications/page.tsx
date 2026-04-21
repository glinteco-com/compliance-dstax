'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ComposeSidebar } from './components/ComposeSidebar'
import { DraftsTab } from './components/DraftsTab'
import { SentTab } from './components/SentTab'
import { cn } from '@/lib/utils'

function CommunicationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'sent' | 'drafts'>('sent')

  const draftIdParam = searchParams.get('draftId')
  const composeParam = searchParams.get('compose')
  const isComposeOpen = draftIdParam !== null || composeParam !== null

  const handleCloseCompose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('draftId')
    newParams.delete('compose')
    router.replace(
      `/communications${newParams.toString() ? `?${newParams.toString()}` : ''}`
    )
  }

  return (
    <div className="flex min-h-full flex-col space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            COMMUNICATIONS
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            Draft and broadcast communications across your organizational
            portfolio.
          </p>
        </div>
        <Button onClick={() => router.push('/communications?compose=new')}>
          <Plus className="mr-2 size-4" />
          COMPOSE NEW EMAIL
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-0">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('sent')}
            className={cn(
              'h-auto rounded-none border-b-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-transparent',
              activeTab === 'sent'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
            )}
          >
            Sent
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('drafts')}
            className={cn(
              'h-auto rounded-none border-b-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-transparent',
              activeTab === 'drafts'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
            )}
          >
            Drafts
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'drafts' ? <DraftsTab /> : <SentTab />}
      </div>

      <ComposeSidebar
        isOpen={isComposeOpen}
        onClose={handleCloseCompose}
        draftId={draftIdParam ? Number(draftIdParam) : null}
      />
    </div>
  )
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunicationsContent />
    </Suspense>
  )
}
