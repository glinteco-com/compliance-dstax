'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFolder: (name: string) => void
}

export function NewFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
}: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState('')

  function handleCreate() {
    const trimmed = folderName.trim()
    if (!trimmed) return
    onCreateFolder(trimmed)
    onOpenChange(false)
    setFolderName('')
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setFolderName('')
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Folder name"
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleCreate()}
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
