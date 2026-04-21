'use client'

import { useState, useCallback } from 'react'
import { CheckIcon, ChevronDownIcon, Loader2, XIcon } from 'lucide-react'
import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { type SelectOption } from '@/components/select/SearchableSelect'

export function LegalEntityMultiSelect({
  clientId,
  value,
  onChange,
  error,
}: {
  clientId: string
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isFetching } = useApiCoreLegalEntityList(
    { client: clientId ? Number(clientId) : undefined, page_size: 100 },
    { query: { enabled: !!clientId } }
  )

  const options: SelectOption[] = (data?.results ?? []).map((entity) => ({
    value: entity.id.toString(),
    label: entity.name,
  }))

  const filteredOptions = search
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  const selectedLabels = value
    .map((val) => options.find((opt) => opt.value.toString() === val)?.label)
    .filter(Boolean) as string[]

  const toggle = useCallback(
    (optionValue: string) => {
      onChange(
        value.includes(optionValue)
          ? value.filter((val) => val !== optionValue)
          : [...value, optionValue]
      )
    },
    [value, onChange]
  )

  const removeTag = (tagValue: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onChange(value.filter((val) => val !== tagValue))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={!clientId}
            className={cn(
              'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive/20'
            )}
          >
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground flex-1 text-left">
                Select legal entities
              </span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={value[index]}
                  className="bg-brand-navy-500 flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-white"
                >
                  {label}
                  <XIcon
                    className="size-3 cursor-pointer"
                    onClick={(event) => removeTag(value[index], event)}
                  />
                </span>
              ))
            )}
            <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={4}
          align="start"
          className="w-auto min-w-(--radix-popover-trigger-width) p-0"
        >
          <div className="border-b p-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center text-sm">
                No legal entities found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isChecked = value.includes(option.value.toString())
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value.toString())}
                    className="focus:bg-accent hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                        isChecked
                          ? 'bg-brand-orange-500 border-brand-orange-500'
                          : 'border-input'
                      )}
                    >
                      {isChecked && <CheckIcon className="size-3 text-white" />}
                    </span>
                    {option.label}
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  )
}
