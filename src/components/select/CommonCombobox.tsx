'use client'

import * as React from 'react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

export interface CommonComboboxProps {
  label?: string
  error?: string
  placeholder?: string
  options: ComboboxOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  id?: string
  /** Render the dropdown into a specific container (e.g. inside a Drawer) instead of document.body. */
  portalContainer?: React.RefObject<HTMLElement | null>
}

const CommonCombobox = React.forwardRef<HTMLInputElement, CommonComboboxProps>(
  (
    {
      label,
      error,
      placeholder = 'Select options',
      options,
      value = [],
      onChange,
      onBlur,
      disabled,
      className,
      id,
      portalContainer,
    },
    ref
  ) => {
    const internalId = React.useId()
    const comboboxId = id || internalId
    const anchorRef = useComboboxAnchor()

    const items = React.useMemo(
      () => options.map((opt) => opt.value),
      [options]
    )

    const labelMap = React.useMemo(() => {
      const map = new Map<string, string>()
      for (const opt of options) {
        map.set(opt.value, opt.label)
      }
      return map
    }, [options])

    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={comboboxId}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <Combobox
          multiple
          autoHighlight
          items={items}
          value={value}
          onValueChange={(newValue, eventDetails) => {
            onChange?.(newValue as string[])
          }}
          disabled={disabled}
        >
          <ComboboxChips ref={anchorRef} aria-invalid={!!error}>
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {(values as string[]).map((v) => (
                    <ComboboxChip key={v}>{labelMap.get(v) ?? v}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    ref={ref}
                    id={comboboxId}
                    placeholder={
                      (values as string[]).length === 0
                        ? placeholder
                        : undefined
                    }
                    onBlur={onBlur}
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchorRef} portalContainer={portalContainer}>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {labelMap.get(item) ?? item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {error && (
          <p className="text-destructive text-xs font-medium">{error}</p>
        )}
      </div>
    )
  }
)
CommonCombobox.displayName = 'CommonCombobox'

export { CommonCombobox }
