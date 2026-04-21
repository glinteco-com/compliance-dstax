'use client'

import { useState, useCallback, useRef } from 'react'
import { FileText, Upload, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/zip',
  'application/x-zip-compressed',
]
const MAX_FILE_BYTES = 25 * 1024 * 1024

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentDropzone({
  value,
  onChange,
}: {
  value: File[]
  onChange: (files: File[]) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const valid: File[] = []
      for (const file of Array.from(files)) {
        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
          toast.error(`${file.name}: unsupported format`)
          continue
        }
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`${file.name}: exceeds 25MB limit`)
          continue
        }
        valid.push(file)
      }
      if (valid.length > 0) onChange([...value, ...valid])
    },
    [value, onChange]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)
      processFiles(event.dataTransfer.files)
    },
    [processFiles]
  )

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors',
          isDragging
            ? 'border-brand-orange-500 bg-brand-orange-500/5'
            : 'border-input hover:border-brand-orange-500/50 hover:bg-accent/50'
        )}
      >
        <Upload className="text-muted-foreground size-8" />
        <div>
          <p className="text-sm font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            PDF, EXCEL, OR ZIP UP TO 25MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.zip"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="bg-muted flex items-center gap-3 rounded-md px-3 py-2"
            >
              <FileText className="text-muted-foreground size-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((_, fileIndex) => fileIndex !== index))
                }
                className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
