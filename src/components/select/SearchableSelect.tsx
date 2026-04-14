'use client'

import { useState, useRef, useCallback, useId, useEffect } from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { CheckIcon, ChevronDownIcon, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SearchableSelectProps {
  label?: string
  error?: string
  placeholder?: string
  searchPlaceholder?: string
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  id?: string
  /**
   * Number of options to show per page. Defaults to 5.
   * In client mode: slices the filtered list and loads more on scroll.
   * In async mode: caller manages paging; `onLoadMore` fires when sentinel is visible.
   */
  pageSize?: number
  /**
   * Async mode — called when the search query changes.
   * When provided, the component switches to async mode:
   * filtering and paging are managed externally.
   */
  onSearch?: (query: string) => void
  /** Async mode — called when the user scrolls near the bottom of the list. */
  onLoadMore?: () => void
  /** Async mode — whether more pages exist. Controls sentinel visibility. */
  hasMore?: boolean
  /** Shows a loading spinner at the bottom of the list. */
  loading?: boolean
}

const DEFAULT_PAGE_SIZE = 5

export function SearchableSelect({
  label,
  error,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  options,
  value,
  onChange,
  onBlur,
  disabled,
  className,
  id,
  pageSize = DEFAULT_PAGE_SIZE,
  onSearch,
  onLoadMore,
  hasMore,
  loading = false,
}: SearchableSelectProps) {
  const internalId = useId()
  const selectId = id || internalId
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isAsync = !!onSearch

  const filteredOptions = (isAsync ? options : options).filter(
    (option) =>
      option.value != null &&
      option.value !== '' &&
      (isAsync ||
        option.label.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const visibleOptions = filteredOptions.slice(
    0,
    isAsync ? filteredOptions.length : visibleCount
  )

  const clientHasMore = !isAsync && filteredOptions.length > visibleCount
  const showSentinel = clientHasMore || (isAsync && hasMore)

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (nextOpen) {
        setSearchQuery('')
        setVisibleCount(pageSize)
      }
    },
    [pageSize]
  )

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => searchInputRef.current?.focus(), 50)
      return () => clearTimeout(timeout)
    }
  }, [open])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !showSentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        if (isAsync) {
          if (hasMore && !loading) onLoadMore?.()
        } else {
          setVisibleCount((previous) => previous + pageSize)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [showSentinel, hasMore, isAsync, loading, onLoadMore, pageSize])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (isAsync) {
        onSearch?.(query)
      } else {
        setVisibleCount(pageSize)
      }
    },
    [isAsync, onSearch, pageSize]
  )

  const handleValueChange = useCallback(
    (val: string) => {
      const matchedOption = options.find(
        (option) => option.value.toString() === val
      )
      onChange?.(matchedOption ? matchedOption.value : val)
    },
    [options, onChange]
  )

  const stringValue = value != null ? value.toString() : ''

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <SelectPrimitive.Root
        value={stringValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          data-slot="select-trigger"
          data-size="default"
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            error && 'border-destructive focus-visible:ring-destructive/20',
            className
          )}
          aria-invalid={!!error}
          onBlur={onBlur}
        >
          <SelectPrimitive.Value
            data-slot="select-value"
            placeholder={placeholder}
          />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="size-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            data-slot="select-content"
            position="popper"
            className={cn(
              'bg-popover text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 relative z-10000 min-w-32 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-md border shadow-md',
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
            )}
          >
            {/* Pinned search input — stopPropagation prevents Radix from capturing pointer/key events */}
            <div
              className="border-b p-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Input
                ref={searchInputRef}
                prefixIcon={<Search />}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="h-8"
              />
            </div>

            {/* Scrollable options viewport */}
            <SelectPrimitive.Viewport className="max-h-60 w-full min-w-(--radix-select-trigger-width) scroll-my-1 overflow-y-auto p-1">
              {visibleOptions.length === 0 && !loading ? (
                <div className="text-muted-foreground py-6 text-center text-sm select-none">
                  No options found
                </div>
              ) : (
                visibleOptions.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value.toString()}
                    value={option.value.toString()}
                    data-slot="select-item"
                    className={cn(
                      "focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-brand-orange-500 [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
                    )}
                  >
                    <span
                      data-slot="select-item-indicator"
                      className="absolute right-2 flex size-3.5 items-center justify-center"
                    >
                      <SelectPrimitive.ItemIndicator>
                        <CheckIcon className="text-brand-orange-500 size-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))
              )}

              {/* Sentinel div triggers load-more when scrolled into view */}
              {showSentinel && <div ref={sentinelRef} className="h-1" />}
            </SelectPrimitive.Viewport>

            {loading && (
              <div className="flex items-center justify-center border-t py-2">
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </div>
            )}
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  )
}
